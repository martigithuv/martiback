const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const saltRounds = 10;

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('L\'usuari ja existeix');
    }

    const user = new User({ name, email, password, role });
    // password hashing is done via pre('save') hook in user model
    await user.save();

    return { id: user._id, name: user.name, email: user.email };
};

const loginUsuario = async ({ email, password }) => {
    if (!email || !password) throw new Error('Faltan credenciales');
    
    console.log('🔍 Buscando usuario con email:', email);
    
    const user = await User.findOne({ email }).select('+password');
    
    console.log('👤 Usuario encontrado:', user ? user.email : 'No encontrado');
    if (!user) throw new Error('Usuario o contraseña incorrectos');

    console.log('🔒 Contraseña hasheada en DB:', user.password);
    console.log('🔑 Contraseña enviada:', password);

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Validación de contraseña:', validPassword);

    if (!validPassword) throw new Error('Usuario o contraseña incorrectos');

    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET || 'marti_marti',
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET || '1234_1234',
        { expiresIn: '7d' }
    );

    user.refreshTokens.push(refreshToken);
    await user.save();

    return { 
        accessToken, 
        refreshToken,
        userId: user._id.toString() 
    };
};

const refrescarAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('No s\'ha proporcionat token de refresc');

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '1234_1234');
    const user = await User.findOne({ _id: decoded.id, refreshTokens: refreshToken });
    if (!user) throw new Error('Token no vàlid');

    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET || 'marti_marti',
        { expiresIn: '15m' }
    );
    return { accessToken };
};

const logoutUsuario = async (refreshToken) => {
    await User.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });
};

const getAllUsers = async () => {
    return await User.find().select('-password');
};

const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

const updateUser = async (userId, updateData) => {
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
        .select('-password');
};

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    registerUser,
    loginUsuario,
    refrescarAccessToken,
    logoutUsuario,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};