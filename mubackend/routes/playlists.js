const express = require('express')
const router = express.Router()
const db = require('../db/database')

// get all playlists
router.get('/', (req, res) => {
    const playlists = db.prepare('SELECT * FROM playlists').all()
    res.json(playlists)
})

//create playlists 
router.post('/', (req, res) => {
    //достаем из тела запроса поле name
    const { name } = req.body
//название должно совпадать с ключем! типо во фронтенде name значит в бэкенде тоже name
    if (!name) {
        return res.status(400).json({ error: 'Укажите название плейлиста'})
    }
    //(name) - это значит так пишется колонка, тип Values(?) - вставляем значение
     db.prepare('INSERT INTO playlists (name) VALUES (?)').run(name)
     res.json({message: 'Плейлист создан'})
})

//add track in playlist 

router.post('/:id/tracks', (req, res) => {
    const { track_id } = req.body
    //params - так как мы данные берем из адресной строки
    const playlist_id = req.params.id
    // проверяем что трек ещё не в плейлисте
    const existing = db.prepare(
        'SELECT * FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?'
    ).get(playlist_id, track_id)

    if (existing) {
        return res.status(400).json({ error: 'Трек уже в плейлисте' })
    }
    //две переменные из за того что нам надо знать в какой именно плейлист какой именно трек добавить
    db.prepare('INSERT INTO playlist_tracks (playlist_id,track_id) VALUES (?,?)').run(playlist_id,track_id)
    res.json({ message: 'Трек добавлен в плейлист'})
})

//get all tracks from playlist
router.get('/:id/tracks', (req, res) => {
    const tracks = db.prepare(`
        SELECT tracks. * FROM tracks
        JOIN playlist_tracks ON tracks.id = playlist_tracks.track_id
        WHERE playlist_tracks.playlist_id = ?`).all(req.params.id)
        res.json(tracks)
})
// DELETE /playlists/:id/tracks/:trackId
router.delete('/:id/tracks/:trackId', (req, res) => {
    const { id, trackId } = req.params
    db.prepare('DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?').run(id, trackId)
    res.json({ success: true })
})

module.exports = router