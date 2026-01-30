/**
 * Login usuario con validación y generación de tokens
 */
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

    console.log('🔐 Generando ACCESS_TOKEN...');
    const accessToken = generarAccessToken(user);
    console.log('🔐 Generando REFRESH_TOKEN...');
    const refreshToken = generarRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    // ← DEVOLVER TAMBIÉN EL userId
    return { 
        accessToken, 
        refreshToken,
        userId: user._id.toString()  // ← AÑADIDO
    };
};