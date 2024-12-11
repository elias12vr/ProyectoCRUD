const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const isAuthenticated = require('../middleware/auth');

// Obtener todos los mangas del usuario autenticado
router.get('/mangas', isAuthenticated, async (req, res) => {
  try {
    const mangas = await Manga.find({ userId: req.session.userId });
    res.render('mangas', { mangas });
  } catch (error) {
    console.error('Error al obtener los mangas:', error);
    res.status(500).json({ error: 'Error del servidor al obtener los mangas' });
  }
});

// Crear un nuevo manga asociado al usuario autenticado
router.post('/mangas', isAuthenticated, async (req, res) => {
  try {
    const { NomManga, Autor, Genero, Precio, Disponibilidad } = req.body;
    
    // Verificar si ya existe un manga con este nombre para el usuario
    const existingManga = await Manga.findOne({ 
      NomManga, 
      userId: req.session.userId 
    });

    if (existingManga) {
      return res.status(409).render('error', { 
        message: 'Ya existe un manga con ese nombre para este usuario' 
      });
    }

    // Crear nuevo manga
    const nuevoManga = new Manga({
      NomManga,
      Autor,
      Genero,
      Precio: parseFloat(Precio),
      Disponibilidad,
      userId: req.session.userId
    });

    await nuevoManga.save();
    res.redirect('/mangas');
  } catch (error) {
    console.error('Error al crear el manga:', error);
    res.status(500).render('error', { 
      message: 'Error del servidor al crear el manga' 
    });
  }
});

// Actualizar un manga
router.put('/mangas/:NomManga', isAuthenticated, async (req, res) => {
  try {
    const { NomManga } = req.params;
    const { Autor, Genero, Precio, Disponibilidad } = req.body;

    const manga = await Manga.findOneAndUpdate(
      { NomManga, userId: req.session.userId }, 
      { 
        Autor, 
        Genero, 
        Precio: parseFloat(Precio), 
        Disponibilidad 
      },
      { new: true }
    );

    if (!manga) {
      return res.status(404).render('error', { 
        message: 'Manga no encontrado' 
      });
    }

    res.redirect('/mangas');
  } catch (error) {
    console.error('Error al actualizar el manga:', error);
    res.status(500).render('error', { 
      message: 'Error al actualizar el manga' 
    });
  }
});

// Eliminar un manga
router.delete('/mangas/:NomManga', isAuthenticated, async (req, res) => {
  try {
    const { NomManga } = req.params;

    const manga = await Manga.findOneAndDelete({ 
      NomManga, 
      userId: req.session.userId 
    });

    if (!manga) {
      return res.status(404).render('error', { 
        message: 'Manga no encontrado' 
      });
    }

    res.redirect('/mangas');
  } catch (error) {
    console.error('Error al eliminar el manga:', error);
    res.status(500).render('error', { 
      message: 'Error al eliminar el manga' 
    });
  }
});

module.exports = router;