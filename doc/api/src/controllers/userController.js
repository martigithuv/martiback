// controllers/userController.js
const User = require('../models/user'); // ajusta la ruta segons el model
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken'); // Descomenta si usas JWT

// Crea un nou usuari
exports.createUserHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Usuari ja existeix' });

        // NOTA: Assegura't que el HASHING es faci en el model User (amb middleware pre('save')).
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'Usuari creat', user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Funció per a l'inici de sessió (Login)
exports.loginUserHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar l'usuari per email. Usem .select('+password') si té 'select: false' al model
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Credencials no vàlides' });
        }

        // 2. Comparar la contrasenya
        // NOTA: El login només funcionarà si la contrasenya es va guardar hasheada.
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credencials no vàlides' });
        }

        // 3. Resposta d'èxit (sense JWT)
        res.json({ message: 'Inici de sessió correcte', user: { name: user.name, email: user.email } });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obté tots els usuaris (sense contrasenya)
exports.getAllUsersHandler = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obté usuari per ID
exports.getUserByIdHandler = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuari no trobat' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Actualitza usuari per ID
exports.updateUserHandler = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuari no trobat' });
        res.json({ message: 'Usuari actualitzat', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Elimina usuari per ID
exports.deleteUserHandler = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuari no trobat' });
        res.json({ message: 'Usuari eliminat' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};