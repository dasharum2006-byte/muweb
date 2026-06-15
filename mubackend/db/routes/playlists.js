const express = require('express')
const router = express.Router()
const db = require('../db/database')

// get all playlists
router.get('/', (req, res) => {
    const playlists = db.prepare('SELECT * FROM playlists').all()
    res.json(playlists)
})

//create playlists 
router.post('/', (request, response) => {
    //достаем из тела запроса поле name
    const { name } = request.body
//название должно совпадать с ключем! типо во фронтенде name значит в бэкенде тоже name
    if (!name) {
        return response.status(400).json({ error: 'Укажите название плейлиста'})
    }
    //(name) - это значит так пишется колонка, тип Values(?) - вставляем значение
     db.prepare('INSERT INTO playlists (name) VALUES (?)').run(name)
     response.json({message: 'Плейлист создан'})
})

//add track in playlist 

router.post('/:id/tracks', (request, response) => {
    const { track_id } = request.body
    //params - так как мы данные берем из адресной строки
    const playlist_id = request.params.id
    //две переменные из за того что нам надо знать в какой именно плейлист какой именно трек добавить
    db.prepare('INSERT INTO playlist_tracks (playlist_id,track_id) VALUES (?,?)').run(playlist_id,track_id)
    res.json({ mrssage: 'Трек добавлен в плейлист'})
})

//get all tracks from playlist
router.get('/', (req, res) => {
    //выбери данные,дай мне все колонки из таблицы с треками
    //склеиваем две таблицы - соединим с таблицей playlist_tracks ON(по какому правилу будем соединять
    //где id песни из таблицы tracks равен track_id из таблицы playlist_tracks
    //where - оставь только строки где...,значение playlist_id равно ?" (вместо ? подставится номер плейлиста
    const tracks = db.prepare(`
        SELECT tracks. * FROM tracks
        JOIN playlist_tracks ON tracks.id = playlist_tracks.track_id
        WHERE playlist_tracks.playlist_id = ?`).all(req.params.id)
        res.json(tracks)
})

module.exports = router