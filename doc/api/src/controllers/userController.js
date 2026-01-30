const userService = require('../services/userService');

//      REGISTER
exports.register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//        LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, userId } = await userService.loginUsuario({ email, password });

        // Devolver también el userId
        res.json({ 
            accessToken, 
            refreshToken,
            userId  // ← AÑADIDO
        });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

//   REFRESH ACCESS TOKEN
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Falta el refreshToken" });
        }

        const tokens = await userService.refrescarAccessToken(refreshToken);
        res.json(tokens);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

//            LOGOUT
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Falta el refreshToken" });
        }

        await userService.logoutUsuario(refreshToken);
        res.json({ message: "Sessió tancada correctament" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//       GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//        GET USER BY ID
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//         UPDATE USER
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.json({ message: "Usuari actualitzat", user: updatedUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//         DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "Usuari eliminat" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};