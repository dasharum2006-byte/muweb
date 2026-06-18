const express = require('express')
const router = express.Router()
const db = require('../db/database')
const multer = require('multer')
const path = require('path')

// настройка загрузки фото артиста
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/covers'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage })

// получить всех артистов
router.get('/', (req, res) => {
    const artists = db.prepare('SELECT * FROM artists').all()
    res.json(artists)
})

// добавить артиста
router.post('/', upload.single('photo'), (req, res) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Укажите имя артиста' })
    const photo = req.file ? req.file.filename : null
    db.prepare('INSERT INTO artists (name, photo) VALUES (?, ?)').run(name, photo)
    res.json({ message: 'Артист добавлен' })
})

// получить треки артиста
router.get('/:id/tracks', (req, res) => {
    const artist = db.prepare('SELECT * FROM artists WHERE id = ?').get(req.params.id)
    if (!artist) return res.status(404).json({ error: 'Артист не найден' })
    const tracks = db.prepare(
        'SELECT * FROM tracks WHERE LOWER(artist) = LOWER(?)'
    ).all(artist.name)
    res.json({ artist, tracks })
})

module.exports = router