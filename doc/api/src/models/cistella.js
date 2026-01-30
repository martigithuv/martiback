// doc/api/src/models/cistella.js

const mongoose = require('mongoose');

const cistellaItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, { _id: true });

const cistellaSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    items: [cistellaItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Método para calcular el total
cistellaSchema.methods.calculateTotal = function() {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

// Método para contar items
cistellaSchema.methods.getItemCount = function() {
    return this.items.reduce((count, item) => {
        return count + item.quantity;
    }, 0);
};

module.exports = mongoose.model('Cistella', cistellaSchema);