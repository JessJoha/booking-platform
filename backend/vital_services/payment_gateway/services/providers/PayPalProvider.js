const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

class PayPalProvider {
    constructor() {
        this.name = 'PayPal Payment Provider';
        this.clientId = process.env.PAYPAL_CLIENT_ID;
        this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
        this.baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production' 
            ? 'https://api.paypal.com' 
            : 'https://api.sandbox.paypal.com';
    }

    async processPayment(payment, paymentDetails) {
        try {
            logger.info('Processing payment with PayPal', {
                transactionId: payment.transactionId,
                amount: payment.amount
            });

            // Get access token
            const accessToken = await this._getAccessToken();

            // Create PayPal order
            const order = await this._createOrder(payment, accessToken);

            return {
                success: true,
                status: 'requires_action',
                paymentIntentId: order.id,
                message: 'PayPal order created, requires approval',
                providerResponse: {
                    provider: 'paypal',
                    order_id: order.id,
                    approval_url: order.links.find(link => link.rel === 'approve')?.href,
                    status: order.status
                }
            };

        } catch (error) {
            logger.error('PayPal provider error', error);
            return {
                success: false,
                status: 'failed',
                message: error.message,
                providerResponse: {
                    provider: 'paypal',
                    error: error.message
                }
            };
        }
    }

    async refundPayment(payment, amount, reason) {
        try {
            logger.info('Processing refund with PayPal', {
                transactionId: payment.transactionId,
                amount
            });

            const accessToken = await this._getAccessToken();
            
            // For this example, we'll use the payment intent ID as the capture ID
            // In a real implementation, you'd store the actual capture ID
            const refund = await this._createRefund(payment.paymentIntentId, amount, reason, accessToken);

            return {
                success: true,
                refundId: refund.id,
                status: refund.status === 'COMPLETED' ? 'succeeded' : 'pending',
                message: 'PayPal refund processed successfully',
                providerResponse: refund
            };

        } catch (error) {
            logger.error('PayPal refund error', error);
            return {
                success: false,
                status: 'failed',
                message: error.message,
                providerResponse: {
                    provider: 'paypal',
                    error: error.message
                }
            };
        }
    }

    async _getAccessToken() {
        try {
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            
            const response = await axios.post(
                `${this.baseUrl}/v1/oauth2/token`,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            throw new Error(`Failed to get PayPal access token: ${error.message}`);
        }
    }

    async _createOrder(payment, accessToken) {
        try {
            const orderData = {
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: payment.transactionId,
                    amount: {
                        currency_code: payment.currency,
                        value: payment.amount.toFixed(2)
                    },
                    description: `Booking payment for ${payment.bookingId}`,
                    custom_id: payment.transactionId
                }],
                application_context: {
                    brand_name: 'Booking Platform',
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW',
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
                }
            };

            const response = await axios.post(
                `${this.baseUrl}/v2/checkout/orders`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw new Error(`Failed to create PayPal order: ${error.message}`);
        }
    }

    async _createRefund(captureId, amount, reason, accessToken) {
        try {
            const refundData = {
                amount: {
                    value: amount.toFixed(2),
                    currency_code: 'USD' // This should be dynamic based on original payment
                },
                note_to_payer: reason || 'Refund processed'
            };

            const response = await axios.post(
                `${this.baseUrl}/v2/payments/captures/${captureId}/refund`,
                refundData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw new Error(`Failed to create PayPal refund: ${error.message}`);
        }
    }
}

module.exports = PayPalProvider;
