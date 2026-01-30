// cistellaController.js

// Funció per obtenir la cistella
export const getCistella = (req, res) => {
    const { userId } = req.params;
    res.json({ success: true, userId, cistella: [] });
};

// Afegir producte
export const afegirProducte = (req, res) => {
    const { productId, quantitat } = req.body;
    res.json({ success: true, productId, quantitat, message: 'Producte afegit' });
};

// Eliminar producte
export const eliminarProducte = (req, res) => {
    const { itemId } = req.params;
    res.json({ success: true, itemId, message: 'Producte eliminat' });
};

// Buidar cistella
export const buidarCistella = (req, res) => {
    const { userId } = req.params;
    res.json({ success: true, userId, message: 'Cistella buidada' });
};

// Actualitzar quantitat
export const actualitzarQuantitat = (req, res) => {
    const { itemId, quantitat } = req.body;
    res.json({ success: true, itemId, quantitat, message: 'Quantitat actualitzada' });
};
