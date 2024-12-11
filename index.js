const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const ejs = require('ejs');
const app = express();
const mangaController = require('./controllers/mangaController');
const authController = require('./controllers/authController');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Motor de plantillas
app.set('view engine', 'ejs');

// Rutas
app.use('/auth', authController); // Rutas para login y register
app.use('/', mangaController);  // Rutas para mangas

mongoose.connect('mongodb+srv://elias12:mariobros123@xiaomi.7besd.mongodb.net/TiendadeMangas')
  .then(() => console.log('Conectado a la base de datos TiendaDeMangas'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

app.listen(3000, function() {
  console.log('Servidor corriendo en el puerto 3000');
});
