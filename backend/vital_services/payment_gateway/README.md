# 💳 Payment Gateway Service

## Overview
High-performance gRPC-based payment processing microservice for the Booking Platform, supporting multiple payment providers and secure transaction processing.

## Features
- **gRPC API**: High-performance binary protocol for service communication
- **Multiple Providers**: Stripe, PayPal, and mock providers
- **Secure Processing**: PCI-compliant payment handling
- **Real-time Status**: Payment status tracking and webhooks
- **Refund Support**: Full and partial refund capabilities
- **Payment History**: Complete transaction history per user
- **Method Validation**: Payment method verification
- **Comprehensive Logging**: Detailed audit trails

## Tech Stack
- **Node.js 18** with gRPC framework
- **MongoDB** for transaction storage
- **Protocol Buffers** for API definition
- **Stripe SDK** for card processing
- **PayPal SDK** for alternative payments
- **Winston** for structured logging

## gRPC Service Definition

### Available Methods
- `ProcessPayment` - Process a new payment
- `GetPaymentStatus` - Get payment status by transaction ID
- `RefundPayment` - Process full or partial refunds
- `GetPaymentHistory` - Get user payment history with pagination
- `ValidatePaymentMethod` - Validate payment method details
- `GetSupportedMethods` - Get list of supported payment methods

### Protocol Buffer Schema
See `proto/payment.proto` for complete message definitions.

## Usage Examples

### gRPC Client (Node.js)
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto definition
const packageDefinition = protoLoader.loadSync('payment.proto');
const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment;

// Create client
const client = new paymentProto.PaymentService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

// Process payment
const paymentRequest = {
    user_id: "123",
    booking_id: "booking_456",
    amount: 99.99,
    currency: "USD",
    payment_method: "card",
    payment_details: {
        card_number: "4242424242424242",
        exp_month: "12",
        exp_year: "2025",
        cvc: "123",
        cardholder_name: "John Doe"
    }
};

client.ProcessPayment(paymentRequest, (error, response) => {
    if (error) {
        console.error('Payment failed:', error);
    } else {
        console.log('Payment response:', response);
    }
});
```

### REST Gateway (Optional)
For REST clients, implement a gateway service that translates HTTP to gRPC.

## Environment Configuration

### Required Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/payment_gateway

# Payment Providers
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox

# gRPC Configuration
GRPC_PORT=50051
GRPC_HOST=0.0.0.0

# Application
DEFAULT_PAYMENT_PROVIDER=mock
LOG_LEVEL=info
NODE_ENV=development
```

## Payment Flow

1. **Payment Request**: Client sends gRPC payment request
2. **Validation**: Request validation and payment method verification
3. **Provider Selection**: Choose appropriate payment provider
4. **Processing**: Process payment with selected provider
5. **Storage**: Store transaction record in MongoDB
6. **Response**: Return payment result to client
7. **Webhooks**: Handle provider webhooks for status updates

## Security Features

- **No card storage**: Payment details are processed but not stored
- **Token-based**: Uses payment tokens when possible
- **Encrypted logging**: Sensitive data is encrypted in logs
- **Provider compliance**: Follows PCI DSS requirements
- **Audit trails**: Complete transaction audit logging

## Monitoring & Observability

- **Structured logging**: JSON-formatted logs with correlation IDs
- **Performance metrics**: Transaction processing times
- **Error tracking**: Detailed error categorization
- **Health checks**: gRPC health check implementation

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Compile Protocol Buffers**:
   ```bash
   npm run proto:compile
   ```

3. **Set environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the service**:
   ```bash
   npm start
   ```

## Docker Deployment

```bash
# Build image
docker build -t payment-gateway .

# Run container
docker run -p 50051:50051 --env-file .env payment-gateway
```

## Integration Points

### With Other Services
- **Reservation Management**: Payment processing for bookings
- **User Management**: User authentication and validation
- **Notification Service**: Payment confirmation notifications
- **Audit Logs**: Transaction audit trail

### Provider Webhooks
Configure webhook endpoints for:
- Stripe: `/webhooks/stripe`
- PayPal: `/webhooks/paypal`

## Testing

```bash
# Run tests
npm test

# Test with grpcurl
grpcurl -plaintext -d '{"user_id":"123","booking_id":"test","amount":10.0,"currency":"USD","payment_method":"card"}' localhost:50051 payment.PaymentService/ProcessPayment
```

## Performance Considerations

- **Connection pooling**: MongoDB connection pooling
- **Request validation**: Early validation to reduce processing time
- **Async processing**: Non-blocking payment processing
- **Caching**: Payment method validation caching
- **Rate limiting**: Built-in rate limiting for security
