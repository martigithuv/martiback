// models/pagament.js
const mongoose = require('mongoose');

const pagamentSchema = new mongoose.Schema({
    // Referencia a la Comanda (id_comanda del DER)
    id_comanda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comanda', 
        required: [true, 'L\'ID de la comanda és obligatori'],
        unique: true // Una comanda només ha de tenir un pagament
    },
    // Método de Pago (metode del DER)
    metode: {
        type: String,
        enum: ['targeta', 'paypal', 'transferència'],
        required: [true, 'El mètode de pagament és obligatori']
    },
    // Importe Total (import total del DER)
    import_total: {
        type: Number,
        required: [true, 'L\'import total del pagament és obligatori'],
        min: [0.01, 'L\'import ha de ser superior a zero']
    },
    // Estado del Pago (estat del DER)
    estat: {
        type: String,
        enum: ['pendent', 'aprovat', 'denegat', 'reemborsat'],
        default: 'pendent'
    },
    // Fecha del Pago (data_pagament del DER)
    data_pagament: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Indexación para buscar rápidamente por Comanda
pagamentSchema.index({ id_comanda: 1 });

module.exports = mongoose.model('Pagament', pagamentSchema);