const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

class MockProvider {
    constructor() {
        this.name = 'Mock Payment Provider';
    }

    async processPayment(payment, paymentDetails) {
        try {
            logger.info('Processing payment with Mock provider', {
                transactionId: payment.transactionId,
                amount: payment.amount
            });

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock success/failure based on amount (for testing)
            const shouldSucceed = payment.amount < 9999;
            const paymentIntentId = `mock_pi_${uuidv4()}`;

            if (shouldSucceed) {
                return {
                    success: true,
                    status: 'succeeded',
                    paymentIntentId,
                    message: 'Payment processed successfully',
                    paymentDetails: paymentDetails?.card_number ? {
                        cardLast4: paymentDetails.card_number.slice(-4),
                        cardBrand: this._getCardBrand(paymentDetails.card_number),
                        cardExpMonth: paymentDetails.exp_month,
                        cardExpYear: paymentDetails.exp_year
                    } : undefined,
                    providerResponse: {
                        provider: 'mock',
                        intent_id: paymentIntentId,
                        status: 'succeeded',
                        processed_at: new Date().toISOString()
                    }
                };
            } else {
                return {
                    success: false,
                    status: 'failed',
                    paymentIntentId,
                    message: 'Payment declined by mock provider',
                    providerResponse: {
                        provider: 'mock',
                        intent_id: paymentIntentId,
                        status: 'failed',
                        error_code: 'card_declined',
                        processed_at: new Date().toISOString()
                    }
                };
            }

        } catch (error) {
            logger.error('Mock provider error', error);
            return {
                success: false,
                status: 'failed',
                message: 'Mock provider processing error',
                providerResponse: {
                    provider: 'mock',
                    error: error.message
                }
            };
        }
    }

    async refundPayment(payment, amount, reason) {
        try {
            logger.info('Processing refund with Mock provider', {
                transactionId: payment.transactionId,
                amount
            });

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 500));

            const refundId = `mock_re_${uuidv4()}`;

            return {
                success: true,
                refundId,
                status: 'succeeded',
                message: 'Refund processed successfully',
                providerResponse: {
                    provider: 'mock',
                    refund_id: refundId,
                    status: 'succeeded',
                    processed_at: new Date().toISOString()
                }
            };

        } catch (error) {
            logger.error('Mock provider refund error', error);
            return {
                success: false,
                status: 'failed',
                message: 'Mock provider refund error',
                providerResponse: {
                    provider: 'mock',
                    error: error.message
                }
            };
        }
    }

    _getCardBrand(cardNumber) {
        const firstDigit = cardNumber.charAt(0);
        const firstTwoDigits = cardNumber.substring(0, 2);
        const firstFourDigits = cardNumber.substring(0, 4);

        if (firstDigit === '4') return 'visa';
        if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'mastercard';
        if (['34', '37'].includes(firstTwoDigits)) return 'amex';
        if (firstFourDigits === '6011') return 'discover';
        
        return 'unknown';
    }
}

module.exports = MockProvider;
