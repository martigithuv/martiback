// cistellaController.js

// Funció per obtenir la cistella
const getCistella = (req, res) => {
    const { userId } = req.params;
    res.json({ success: true, userId, cistella: [] });
};

// Afegir producte
const afegirProducte = (req, res) => {
    const { productId, quantitat } = req.body;
    res.json({ success: true, productId, quantitat, message: 'Producte afegit' });
};

// Eliminar producte
const eliminarProducte = (req, res) => {
    const { itemId } = req.params;
    res.json({ success: true, itemId, message: 'Producte eliminat' });
};

// Buidar cistella
const buidarCistella = (req, res) => {
    const { userId } = req.params;
    res.json({ success: true, userId, message: 'Cistella buidada' });
};

// Actualitzar quantitat
const actualitzarQuantitat = (req, res) => {
    const { itemId, quantitat } = req.body;
    res.json({ success: true, itemId, quantitat, message: 'Quantitat actualitzada' });
};

module.exports = {
    getCistella,
    afegirProducte,
    eliminarProducte,
    buidarCistella,
    actualitzarQuantitat
};
