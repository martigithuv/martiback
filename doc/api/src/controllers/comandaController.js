const comandaService = require('../services/comandaService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Comanda = require('../models/comanda');
const Product = require('../models/product');

/**
 * Crea una nueva comanda. (POST /api/comandes)
 */
const createComandaHandler = async (req, res) => {
    try {
        const newComanda = await comandaService.createComanda(req.body);
        res.status(201).json(newComanda);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación al crear comanda', details: error.message });
        }
        res.status(500).json({ message: 'Error al crear la comanda', error: error.message });
    }
};

/**
 * Crea una sesión de checkout de Stripe. (POST /api/checkout/create-session)
 */
const createCheckoutSession = async (req, res, next) => {
    try {
        const { products } = req.body;

        req.log.info({
            requestId: req.requestId,
            userId: req.body.userId || (req.user ? req.user._id : 'anonymous'),
            productCount: products?.length || 0
        }, 'Creating checkout session');

        if (!products || products.length === 0) {
            req.log.warn({
                requestId: req.requestId
            }, 'Empty cart attempt');
            return res.status(400).json({ message: 'El carrito no puede estar vacío' });
        }

        // Fallback para testing local si no hay usuario logueado
        const userId = req.body.userId || (req.user ? req.user._id : '691455ad5698b86dda8fa073');

        const lineItems = [];
        const detallComanda = [];
        let importTotal = 0;

        for (const item of products) {
            const product = await Product.findById(item.id_producte);
            
            if (!product) {
                req.log.error({
                    requestId: req.requestId,
                    productId: item.id_producte
                }, 'Product not found in checkout');
                return res.status(404).json({ message: `Producto no encontrado: ${item.id_producte}` });
            }

            if (product.stock < item.quantitat) {
                req.log.warn({
                    requestId: req.requestId,
                    productId: product._id,
                    requestedQty: item.quantitat,
                    availableStock: product.stock
                }, 'Insufficient stock');
                return res.status(400).json({ message: `Stock insuficiente para el producto: ${product.name}` });
            }

            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantitat,
            });

            detallComanda.push({
                id_producte: product._id,
                quantitat: item.quantitat,
                preu_unitari: product.price
            });

            importTotal += product.price * item.quantitat;
        }

        const newComanda = new Comanda({
            id_usuari: userId,
            detall_comanda: detallComanda,
            import_total: importTotal,
            estat: 'pendent'
        });

        await newComanda.save();

        req.log.info({
            requestId: req.requestId,
            orderId: newComanda._id,
            userId: userId,
            total: importTotal,
            itemCount: detallComanda.length
        }, 'Order created');

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?cancel=true`,
            metadata: {
                comandaId: newComanda._id.toString()
            }
        });

        req.log.info({
            requestId: req.requestId,
            orderId: newComanda._id,
            sessionId: session.id
        }, 'Stripe session created');

        res.json({ sessionId: session.id });
    } catch (error) {
        req.log.error({
            requestId: req.requestId,
            error: error.message
        }, 'Checkout session error');
        res.status(500).json({ message: error.message || 'Error interno al crear la sesión de pago' });
    }
};

/**
 * Maneja los webhooks de Stripe para confirmar el pago.
 */
const stripeWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        req.log.error({
            requestId: req.requestId,
            error: err.message
        }, 'Webhook signature verification failed');
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const comandaId = session.metadata.comandaId;

        try {
            req.log.info({
                requestId: req.requestId,
                orderId: comandaId,
                sessionId: session.id
            }, 'Payment confirmed via webhook');

            const comanda = await Comanda.findById(comandaId);
            if (comanda) {
                comanda.estat = 'pagat';
                await comanda.save();

                for (const item of comanda.detall_comanda) {
                    await Product.findByIdAndUpdate(item.id_producte, {
                        $inc: { stock: -item.quantitat }
                    });
                }

                req.log.info({
                    requestId: req.requestId,
                    orderId: comandaId,
                    userId: comanda.id_usuari,
                    total: comanda.import_total
                }, 'Payment processed and stock updated');
            }
        } catch (error) {
            req.log.error({
                requestId: req.requestId,
                orderId: comandaId,
                error: error.message
            }, 'Error processing payment webhook');
            return res.status(500).json({ message: 'Error interno al procesar el pago' });
        }
    }

    res.json({ received: true });
};

/**
 * Obtiene todas las comandas. (GET /api/comandes)
 */
const getAllComandasHandler = async (req, res) => {
    try {
        const userId = req.query.userId || null; 
        const comandas = await comandaService.getAllComandas(userId);
        res.status(200).json(comandas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las comandas', error: error.message });
    }
};

/**
 * Obtiene una comanda por ID. (GET /api/comandes/:id)
 */
const getComandaByIdHandler = async (req, res) => {
    try {
        const comanda = await comandaService.getComandaById(req.params.id);
        if (!comanda) {
            return res.status(404).json({ message: 'Comanda no encontrada.' });
        }
        res.status(200).json(comanda);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de comanda no válido.' });
        }
        res.status(500).json({ message: 'Error al obtener la comanda', error: error.message });
    }
};

/**
 * Actualiza una comanda por ID. (PUT /api/comandes/:id)
 */
const updateComandaHandler = async (req, res) => {
    try {
        const updatedComanda = await comandaService.updateComanda(req.params.id, req.body);
        if (!updatedComanda) {
            return res.status(404).json({ message: 'Comanda no encontrada.' });
        }
        res.status(200).json(updatedComanda);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de comanda no válido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación al actualizar', details: error.message });
        }
        res.status(500).json({ message: 'Error al actualizar la comanda', error: error.message });
    }
};

/**
 * Elimina una comanda por ID. (DELETE /api/comandes/:id)
 */
const deleteComandaHandler = async (req, res) => {
    try {
        const deletedComanda = await comandaService.deleteComanda(req.params.id);
        if (!deletedComanda) {
            return res.status(404).json({ message: 'Comanda no encontrada.' });
        }
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de comanda no válido.' });
        }
        res.status(500).json({ message: 'Error al eliminar la comanda', error: error.message });
    }
};

module.exports = {
    createComandaHandler,
    createCheckoutSession,
    stripeWebhook,
    getAllComandasHandler,
    getComandaByIdHandler,
    updateComandaHandler,
    deleteComandaHandler
};
