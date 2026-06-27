//создаем сервер это кухня
const express = require('express')
//разрешает другим сайтам обращаться к нашему серваку или браузер нас заблочит
const cors = require('cors')
require('dotenv').config()
//помогает правильно находить папки на компе
const path = require('path')
//добавили после создания database.js сюда чтобы мы получили базу данных
const db = require('./db/database')
const authRouter = require('./routes/auth')
//после того как мы написали track.js
const tracksRouter = require('./routes/tracks')
//for playlists.js
const playlistsRouter = require('./routes/playlists')
//add new router for artist
const artistsRouter = require('./routes/artists')
//создаем сервак
const muweb = express()
//чтобы сервак понимал jsonn и обычные файлы
//мы пускаем посетителей с разных адресов
muweb.use(cors())
//учит сервер понимать json формат
muweb.use(express.json())
muweb.use('/auth', authRouter)
//отдаем музыкальные файлы по адресу /uploads/имя_файла.mp3
//сначала идет адрес по которому будут доступны файлы,команда - отдать файл какой он есть,где физически лежат наши файлы на компе
muweb.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//get - когда кто то заходит на главный адрес 3000, req - запрос что хочет посетитель,res - ответ что мы даем посетителю, res.json - отправляем ответ в формате json
//тестовый роут - взлетно посадочная полоса - router.get('/')
//add after creating track.js
//вставляем чтобы у нас фронтенд подключился
muweb.use(express.static(path.join(__dirname, '../mufrontend')))
muweb.use('/tracks', tracksRouter)
muweb.use('/playlists', playlistsRouter)
//add for artists
muweb.use('/artists', artistsRouter)
muweb.get('/', (req, res) => {
    res.json({ message: 'Сервер работает'})
})
//req,res - конкретный диспетчер за рулем

//запускаем сервак
muweb.listen(3000, () => {
    console.log('Сервер запущен http://localhost:3000')
})
// Эта строчка открывает доступ к папке uploads для фронтенда
muweb.use('/uploads', express.static(path.join(__dirname, 'uploads')));
