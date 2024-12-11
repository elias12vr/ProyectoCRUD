const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    NomManga: { type: String, required: true },
    Autor: { type: String, required: true },
    Genero: { type: String, required: true },
    Precio: { type: Number, required: true },
    Disponibilidad: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Relación con el usuario
});

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;
