const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si ya existe un usuario con ese correo
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('El correo ya está registrado');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.redirect('/login'); // Redirigir al login después de registrarse
    } catch (error) {
        res.status(500).send('Error al registrar el usuario');
    }
});

// Ruta para hacer login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por correo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Correo o contraseña incorrectos');
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Correo o contraseña incorrectos');
        }

        // Guardar la sesión del usuario
        req.session.userId = user._id; // Asociar sesión con el usuario
        res.redirect('/mangas');
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta para hacer logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/auth/login'); // Redirigir al login después de hacer logout
    });
});

module.exports = router;
