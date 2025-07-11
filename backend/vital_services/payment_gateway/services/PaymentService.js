const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const StripeProvider = require('./providers/StripeProvider');
const PayPalProvider = require('./providers/PayPalProvider');
const MockProvider = require('./providers/MockProvider');
const logger = require('../utils/logger');

class PaymentService {
    constructor() {
        this.providers = {
            stripe: new StripeProvider(),
            paypal: new PayPalProvider(),
            mock: new MockProvider()
        };
    }

    async processPayment(request) {
        try {
            const transactionId = uuidv4();
            
            // Validate payment request
            const validation = this._validatePaymentRequest(request);
            if (!validation.isValid) {
                return {
                    success: false,
                    transaction_id: transactionId,
                    status: 'failed',
                    message: validation.message,
                    amount_charged: 0,
                    currency: request.currency,
                    created_at: Date.now(),
                    metadata: {}
                };
            }

            // Create payment record
            const payment = new Payment({
                transactionId,
                userId: request.user_id,
                bookingId: request.booking_id,
                amount: request.amount,
                currency: request.currency,
                paymentMethod: request.payment_method,
                status: 'pending',
                paymentProvider: process.env.DEFAULT_PAYMENT_PROVIDER || 'mock',
                billingAddress: request.payment_details?.billing_address ? {
                    street: request.payment_details.billing_address.street,
                    city: request.payment_details.billing_address.city,
                    state: request.payment_details.billing_address.state,
                    postalCode: request.payment_details.billing_address.postal_code,
                    country: request.payment_details.billing_address.country
                } : undefined,
                metadata: new Map(Object.entries(request.metadata || {}))
            });

            await payment.save();

            // Process payment with provider
            const provider = this.providers[payment.paymentProvider];
            const result = await provider.processPayment(payment, request.payment_details);

            // Update payment status
            payment.status = result.status;
            payment.paymentIntentId = result.paymentIntentId;
            payment.providerResponse = result.providerResponse;
            
            if (result.paymentDetails) {
                payment.paymentDetails = result.paymentDetails;
            }
            
            if (!result.success) {
                payment.failureReason = result.message;
            }

            await payment.save();

            logger.info('Payment processed', {
                transactionId,
                status: payment.status,
                amount: payment.amount
            });

            return {
                success: result.success,
                transaction_id: transactionId,
                payment_intent_id: payment.paymentIntentId,
                status: payment.status,
                message: result.message,
                amount_charged: result.success ? payment.amount : 0,
                currency: payment.currency,
                created_at: payment.createdAt.getTime(),
                metadata: Object.fromEntries(payment.metadata)
            };

        } catch (error) {
            logger.error('Error processing payment', error);
            throw error;
        }
    }

    async getPaymentStatus(request) {
        try {
            const payment = await Payment.findOne({ transactionId: request.transaction_id });
            
            if (!payment) {
                return {
                    found: false,
                    transaction_id: request.transaction_id,
                    status: '',
                    amount: 0,
                    currency: '',
                    created_at: 0,
                    updated_at: 0,
                    metadata: {}
                };
            }

            return {
                found: true,
                transaction_id: payment.transactionId,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                created_at: payment.createdAt.getTime(),
                updated_at: payment.updatedAt.getTime(),
                metadata: Object.fromEntries(payment.metadata)
            };

        } catch (error) {
            logger.error('Error getting payment status', error);
            throw error;
        }
    }

    async refundPayment(request) {
        try {
            const payment = await Payment.findOne({ transactionId: request.transaction_id });
            
            if (!payment) {
                throw new Error('Payment not found');
            }

            if (payment.status !== 'succeeded') {
                throw new Error('Can only refund successful payments');
            }

            const refundAmount = request.amount || payment.amount;
            const totalRefunded = payment.totalRefunded;
            
            if (totalRefunded + refundAmount > payment.amount) {
                throw new Error('Refund amount exceeds payment amount');
            }

            // Process refund with provider
            const provider = this.providers[payment.paymentProvider];
            const result = await provider.refundPayment(payment, refundAmount, request.reason);

            // Add refund record
            const refundData = {
                refundId: result.refundId,
                amount: refundAmount,
                status: result.status,
                reason: request.reason || 'Refund requested'
            };

            await payment.addRefund(refundData);

            logger.info('Refund processed', {
                transactionId: payment.transactionId,
                refundId: result.refundId,
                amount: refundAmount
            });

            return {
                success: result.success,
                refund_id: result.refundId,
                transaction_id: payment.transactionId,
                amount_refunded: refundAmount,
                currency: payment.currency,
                status: result.status,
                message: result.message,
                created_at: Date.now()
            };

        } catch (error) {
            logger.error('Error processing refund', error);
            throw error;
        }
    }

    async getPaymentHistory(request) {
        try {
            const page = request.page || 1;
            const limit = Math.min(request.limit || 20, 100); // Max 100 per page
            const skip = (page - 1) * limit;

            const query = Payment.findByUser(request.user_id, {
                status: request.status_filter,
                startDate: request.start_date,
                endDate: request.end_date
            });

            const [payments, totalCount] = await Promise.all([
                query.skip(skip).limit(limit),
                Payment.countDocuments(query.getQuery())
            ]);

            const paymentRecords = payments.map(payment => ({
                transaction_id: payment.transactionId,
                booking_id: payment.bookingId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                payment_method: payment.paymentMethod,
                created_at: payment.createdAt.getTime(),
                updated_at: payment.updatedAt.getTime(),
                metadata: Object.fromEntries(payment.metadata)
            }));

            return {
                payments: paymentRecords,
                total_count: totalCount,
                page,
                limit,
                has_next_page: skip + limit < totalCount
            };

        } catch (error) {
            logger.error('Error getting payment history', error);
            throw error;
        }
    }

    async validatePaymentMethod(request) {
        try {
            const validationErrors = [];

            // Validate payment method type
            const supportedMethods = ['card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay'];
            if (!supportedMethods.includes(request.payment_method)) {
                validationErrors.push('Unsupported payment method');
            }

            // Validate card details if method is card
            if (request.payment_method === 'card' && request.payment_details) {
                const cardValidation = this._validateCardDetails(request.payment_details);
                validationErrors.push(...cardValidation);
            }

            return {
                is_valid: validationErrors.length === 0,
                message: validationErrors.length === 0 ? 'Payment method is valid' : 'Validation failed',
                validation_errors: validationErrors
            };

        } catch (error) {
            logger.error('Error validating payment method', error);
            throw error;
        }
    }

    async getSupportedMethods() {
        try {
            const methods = [
                {
                    method_id: 'card',
                    name: 'Credit/Debit Card',
                    description: 'Pay with Visa, Mastercard, American Express',
                    enabled: true,
                    supported_currencies: ['USD', 'EUR', 'GBP', 'CAD'],
                    configuration: {
                        'min_amount': '0.50',
                        'max_amount': '10000.00'
                    }
                },
                {
                    method_id: 'paypal',
                    name: 'PayPal',
                    description: 'Pay with your PayPal account',
                    enabled: true,
                    supported_currencies: ['USD', 'EUR', 'GBP'],
                    configuration: {
                        'min_amount': '1.00',
                        'max_amount': '5000.00'
                    }
                },
                {
                    method_id: 'apple_pay',
                    name: 'Apple Pay',
                    description: 'Pay with Touch ID or Face ID',
                    enabled: true,
                    supported_currencies: ['USD', 'EUR', 'GBP'],
                    configuration: {
                        'min_amount': '1.00',
                        'max_amount': '2000.00'
                    }
                },
                {
                    method_id: 'google_pay',
                    name: 'Google Pay',
                    description: 'Pay with your Google account',
                    enabled: true,
                    supported_currencies: ['USD', 'EUR', 'GBP'],
                    configuration: {
                        'min_amount': '1.00',
                        'max_amount': '2000.00'
                    }
                }
            ];

            return { methods };

        } catch (error) {
            logger.error('Error getting supported methods', error);
            throw error;
        }
    }

    _validatePaymentRequest(request) {
        const errors = [];

        if (!request.user_id) errors.push('User ID is required');
        if (!request.booking_id) errors.push('Booking ID is required');
        if (!request.amount || request.amount <= 0) errors.push('Valid amount is required');
        if (!request.currency) errors.push('Currency is required');
        if (!request.payment_method) errors.push('Payment method is required');

        if (request.amount > 10000) {
            errors.push('Amount exceeds maximum limit');
        }

        return {
            isValid: errors.length === 0,
            message: errors.length > 0 ? errors.join(', ') : 'Valid request'
        };
    }

    _validateCardDetails(details) {
        const errors = [];

        if (!details.card_number || details.card_number.length < 13) {
            errors.push('Invalid card number');
        }

        if (!details.exp_month || !details.exp_year) {
            errors.push('Expiration date is required');
        }

        if (!details.cvc || details.cvc.length < 3) {
            errors.push('Invalid CVC');
        }

        if (!details.cardholder_name) {
            errors.push('Cardholder name is required');
        }

        return errors;
    }
}

module.exports = PaymentService;
