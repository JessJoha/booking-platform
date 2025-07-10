const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    bookingId: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'requires_action'],
        default: 'pending'
    },
    paymentIntentId: {
        type: String,
        index: true
    },
    paymentProvider: {
        type: String,
        required: true,
        enum: ['stripe', 'paypal', 'square', 'mock'],
        default: 'stripe'
    },
    paymentDetails: {
        cardLast4: String,
        cardBrand: String,
        cardExpMonth: String,
        cardExpYear: String
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    },
    fees: {
        processingFee: {
            type: Number,
            default: 0
        },
        platformFee: {
            type: Number,
            default: 0
        }
    },
    refunds: [{
        refundId: String,
        amount: Number,
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed', 'cancelled']
        },
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    failureReason: String,
    providerResponse: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentProvider: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
    return this.refunds
        .filter(refund => refund.status === 'succeeded')
        .reduce((total, refund) => total + refund.amount, 0);
});

// Methods
paymentSchema.methods.updateStatus = function(status, failureReason = null) {
    this.status = status;
    if (failureReason) {
        this.failureReason = failureReason;
    }
    return this.save();
};

paymentSchema.methods.addRefund = function(refundData) {
    this.refunds.push(refundData);
    return this.save();
};

paymentSchema.methods.toResponse = function() {
    return {
        transaction_id: this.transactionId,
        user_id: this.userId,
        booking_id: this.bookingId,
        amount: this.amount,
        currency: this.currency,
        payment_method: this.paymentMethod,
        status: this.status,
        payment_intent_id: this.paymentIntentId,
        created_at: this.createdAt.getTime(),
        updated_at: this.updatedAt.getTime(),
        metadata: Object.fromEntries(this.metadata || new Map())
    };
};

// Static methods
paymentSchema.statics.findByUser = function(userId, options = {}) {
    const query = this.find({ userId });
    
    if (options.status) {
        query.where('status').equals(options.status);
    }
    
    if (options.startDate) {
        query.where('createdAt').gte(new Date(options.startDate));
    }
    
    if (options.endDate) {
        query.where('createdAt').lte(new Date(options.endDate));
    }
    
    return query.sort({ createdAt: -1 });
};

paymentSchema.statics.findByBooking = function(bookingId) {
    return this.findOne({ bookingId });
};

module.exports = mongoose.model('Payment', paymentSchema);
