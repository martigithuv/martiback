// models/enviament.js
const mongoose = require('mongoose');

const enviamentSchema = new mongoose.Schema({
    // Referencia a la Comanda (id_comanda del DER)
    id_comanda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comanda', 
        required: [true, 'L\'ID de la comanda és obligatori'],
        unique: true // Una comanda només ha de tenir un enviament
    },
    // Empresa de Transporte (empresa_transport del DER)
    empresa_transport: {
        type: String,
        required: [true, 'L\'empresa de transport és obligatòria'],
        minlength: [2, 'El nom ha de tenir almenys 2 caràcters']
    },
    // Código de Seguimiento (codi_seguiment del DER)
    codi_seguiment: {
        type: String,
        required: [true, 'El codi de seguiment és obligatori'],
        unique: true // Cada enviament té un codi de seguiment únic
    },
    // Fecha de Salida (data_sortida del DER)
    data_sortida: {
        type: Date,
        default: Date.now
    },
    // Fecha de Llegada Estimada (data_arribada del DER)
    data_arribada: {
        type: Date,
        required: [true, 'La data d\'arribada estimada és obligatòria']
    },
    // Estado del Envío (estat_enviament, es un atributo del Enviament en el DER)
    estat_enviament: {
        type: String,
        enum: ['preparat', 'en trànsit', 'en repartiment', 'lliurat', 'incident'],
        default: 'preparat'
    }
}, { timestamps: true });

// Indexación para buscar rápidamente por Comanda
enviamentSchema.index({ id_comanda: 1 });
// Indexación para buscar rápidamente por código de seguimiento
enviamentSchema.index({ codi_seguiment: 1 });

module.exports = mongoose.model('Enviament', enviamentSchema);