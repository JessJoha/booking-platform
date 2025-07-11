const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../../utils/logger');

class StripeProvider {
    constructor() {
        this.name = 'Stripe Payment Provider';
        this.stripe = stripe;
    }

    async processPayment(payment, paymentDetails) {
        try {
            logger.info('Processing payment with Stripe', {
                transactionId: payment.transactionId,
                amount: payment.amount
            });

            // Create payment intent
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(payment.amount * 100), // Convert to cents
                currency: payment.currency.toLowerCase(),
                payment_method_types: ['card'],
                metadata: {
                    transaction_id: payment.transactionId,
                    booking_id: payment.bookingId,
                    user_id: payment.userId
                }
            });

            // If payment details are provided, confirm the payment
            if (paymentDetails && paymentDetails.card_number) {
                const paymentMethod = await this.stripe.paymentMethods.create({
                    type: 'card',
                    card: {
                        number: paymentDetails.card_number,
                        exp_month: parseInt(paymentDetails.exp_month),
                        exp_year: parseInt(paymentDetails.exp_year),
                        cvc: paymentDetails.cvc
                    },
                    billing_details: {
                        name: paymentDetails.cardholder_name,
                        address: payment.billingAddress ? {
                            line1: payment.billingAddress.street,
                            city: payment.billingAddress.city,
                            state: payment.billingAddress.state,
                            postal_code: payment.billingAddress.postalCode,
                            country: payment.billingAddress.country
                        } : undefined
                    }
                });

                const confirmedIntent = await this.stripe.paymentIntents.confirm(paymentIntent.id, {
                    payment_method: paymentMethod.id
                });

                return this._formatStripeResponse(confirmedIntent, paymentMethod);
            }

            return {
                success: true,
                status: 'requires_action',
                paymentIntentId: paymentIntent.id,
                message: 'Payment intent created, requires confirmation',
                providerResponse: paymentIntent
            };

        } catch (error) {
            logger.error('Stripe provider error', error);
            return {
                success: false,
                status: 'failed',
                message: error.message,
                providerResponse: {
                    provider: 'stripe',
                    error: error.message,
                    type: error.type,
                    code: error.code
                }
            };
        }
    }

    async refundPayment(payment, amount, reason) {
        try {
            logger.info('Processing refund with Stripe', {
                transactionId: payment.transactionId,
                amount
            });

            const refund = await this.stripe.refunds.create({
                payment_intent: payment.paymentIntentId,
                amount: Math.round(amount * 100), // Convert to cents
                reason: reason || 'requested_by_customer',
                metadata: {
                    transaction_id: payment.transactionId,
                    original_amount: payment.amount
                }
            });

            return {
                success: true,
                refundId: refund.id,
                status: refund.status === 'succeeded' ? 'succeeded' : 'pending',
                message: 'Refund processed successfully',
                providerResponse: refund
            };

        } catch (error) {
            logger.error('Stripe refund error', error);
            return {
                success: false,
                status: 'failed',
                message: error.message,
                providerResponse: {
                    provider: 'stripe',
                    error: error.message,
                    type: error.type,
                    code: error.code
                }
            };
        }
    }

    _formatStripeResponse(paymentIntent, paymentMethod = null) {
        const status = this._mapStripeStatus(paymentIntent.status);
        const success = status === 'succeeded';

        const response = {
            success,
            status,
            paymentIntentId: paymentIntent.id,
            message: success ? 'Payment processed successfully' : `Payment ${status}`,
            providerResponse: paymentIntent
        };

        if (paymentMethod && paymentMethod.card) {
            response.paymentDetails = {
                cardLast4: paymentMethod.card.last4,
                cardBrand: paymentMethod.card.brand,
                cardExpMonth: paymentMethod.card.exp_month.toString(),
                cardExpYear: paymentMethod.card.exp_year.toString()
            };
        }

        return response;
    }

    _mapStripeStatus(stripeStatus) {
        const statusMap = {
            'requires_payment_method': 'failed',
            'requires_confirmation': 'requires_action',
            'requires_action': 'requires_action',
            'processing': 'processing',
            'requires_capture': 'processing',
            'canceled': 'cancelled',
            'succeeded': 'succeeded'
        };

        return statusMap[stripeStatus] || 'failed';
    }
}

module.exports = StripeProvider;
