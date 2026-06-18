//в этом файле мы получаем все треки,загружаем их,ставим лайк или дизлайк,удаляем трек
//подключаем все,библиотеки и базу данных,route - мини сервер только для треков
//главный инструмент для создания сервера,загружаем и сохраняем в переменную как швейцарский нож
const express = require('express')
//мы создаем отдельного диспетчера который будет обрабатывать определенные маршруты
//функция которая создает маршрутизатор,диспетчерская вышка
const router = express.Router()
//бибилтиотека для загрузки файлов на сервер(пользователь отправляет файл он его принимаети сохраняет на сервер)
const multer = require('multer')
//работы с путями- склеивает пути и получает расширения от файлов - штурман
const path = require('path')
//подключаем базу данных
const db = require('../db/database')

//настраиваем загрузку файлов
//говорим multer куда сохранять файлы (uploads/) и как называть - берем текущее время чтобы имена не повторялись
//короче как почтальон - он принимает данные от пользователя(песни),затем кладет их в нужную папку на сервере и дает им уникальное имя,
//чтобы файлы не перезаписывали друг друга
//mulet - human who get file, storage - instruction(where we had to put photos and how it named,
// destination - folder, where we put photos,filename - how we named every photo, date.now - time on photo)

//destination tells multer - мы кладем файлы в эту папку, destination - key
//(req, file, cb) => { ... } — это функция
//Multer вызовет эту функцию для каждого загруженного файла.

//Параметр	Что в нём лежит	Пример
//req	Объект запроса (все данные от пользователя)	Может содержать название песни, исполнителя и т.д.
//file	Информация о файле	Имя файла, размер, тип
//cb	Callback (функция, которую нужно вызвать, когда закончите)	Способ сказать Multer'у: "Я готов, вот тебе результат"
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        //ошибка если есть она высветиться и путь к файлу (куда сохранять файл) и затем строим путь к папке(тип мы ищем где находиться текущий файл и поднимаемся нв уровень выше в папкк uploads)
        callBack(null, path.join(__dirname,'../uploads'))
    },
//функция  которая говорит - называй файлы вот так
//date.now()-функция в миллисекундах,чтобы файлы никогда не повторялись,
//получаем расширение файла - path.extname(file.originalname) - то есть достает расширение файла затем склеиваем время и расширение
    filename: (req, file, callBack) => {
        const uniqueName = Date.now() + path.extname(file.originalname)
        callBack(null,uniqueName)
    }
})
//другие способы чтобы назвать каждый файл
        // Способ 1: только время
        //const uniqueName = Date.now() + path.extname(file.originalname)

        // Способ 2: время + случайное число
        //const uniqueName = Date.now() + '-' + Math.random() +.all() — вернуть все строки (массив)

        // Способ 3: UUID (универсальный уникальный идентификатор)
        //const { v4: uuidv4 } = require('uuid')
        //const uniqueName = uuidv4() + path.extname(file.originalname)

        // Способ 4: оригинальное имя + время
        //const uniqueName = Date.now() + '-' + file.originalname

//мы вызываем функцию multer с настройками,затем передаем наши настройки и сохраняем настроенного
//загрузчика в переменную - типо теперь мы можем принимать файлы,класть их в папку uploads/,и давать им уникальные имена
const upload = multer({storage: storage})
// //это типо магазин наших песен
// //get all tracks(сервер идет в бд и запрашивает все треки и сервер потом возвращает json со списком песен)
// router.get('/', (req, res) => {
//     // в базе данных для all
//     //.all() — вернуть все строки (массив)
//     //.get() — вернуть только первую строку (одну запись)
//     //.run() — выполнить, но ничего не возвращать (для INSERT, UPDATE, DELETE)
//     //
//     const tracks = db.prepare('SELECT * FROM tracks').all()
//     //получается пользователю отправиться json
//     res.json(tracks)
// } )


router.get('/', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    // если нет токена — отдаём все треки
    if (!token) {
        const tracks = db.prepare('SELECT * FROM tracks').all()
        return res.json(tracks)
    }
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.SECRET)
    const userId = decoded.id
    // отдаём треки кроме дизлайкнутых этим пользователем
    const tracks = db.prepare(`
        SELECT tracks.* FROM tracks
        WHERE tracks.id NOT IN (
            SELECT track_id FROM disliked_tracks WHERE user_id = ?
        )
    `).all(userId)
    res.json(tracks)
})


//download track.Post - - отправить данные(создаит или записать)
 router.post('/upload', upload.single('audio'), (req, res)=> {
    //мы достаем данные из запроса - добавили cover
    const {title, artist, cover} = req.body
    //мы используем деструктуризацию а по длинному пути чтобы достать эти данные нам надо прописывать так 
    //const title = req.body.title   // достаю подарок с ярлыком "title"
    //const artist = req.body.artist // достаю подарок с ярлыком "artist"
    if (!title || !artist) {
        return res.status(400).json({ error: 'Укажите название и артиста' })
    }
//insert into tracks - add new row in table tracks добавляем трек
    const result = db.prepare(
        'INSERT INTO TRACKS (title, artist, filename, cover) VALUES (?,?,?,?)').run(title, artist, req.file.filename, cover || null)
        //достаем id пользователя из токена
        const token = req.headers.authorization?.split(' ')[1]
        const jwt = require('jsonwebtoken')
        //!!! тоже заменили строку с токеном!!!!!!!!!!!
        const decoded = jwt.verify(token, process.env.SECRET)
        // добавляем в библиотеку пользователя
        db.prepare(
            'INSERT OR IGNORE INTO user_library (user_id, track_id) VALUES (?,?)'
        ).run(decoded.id, result.lastInsertRowid)
        res.json({message: 'Трек загружен' })
 })


router.post('/:id/like', (req, res) => {
    const id = parseInt(req.params.id)
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Нет токена' })
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.SECRET)
    const userId = decoded.id
    // проверяем лайкал ли уже
    const existing = db.prepare(
        'SELECT * FROM track_likes WHERE user_id = ? AND track_id = ?'
    ).get(userId, id)
    if (existing) {
        // уже лайкнул — просто возвращаем текущее количество
        const track = db.prepare('SELECT likes FROM tracks WHERE id = ?').get(id)
        return res.json({ likes: track.likes, alreadyLiked: true })
    }
    // ещё не лайкал — добавляем
    db.prepare('INSERT INTO track_likes (user_id, track_id) VALUES (?,?)').run(userId, id)
    db.prepare('UPDATE tracks SET likes = likes + 1 WHERE id = ?').run(id)
    const track = db.prepare('SELECT likes FROM tracks WHERE id = ?').get(id)
    res.json({ likes: track.likes, alreadyLiked: false })
})


//!!!!!!!!!!!!!!!!!!!!!!!!!!1
 //удаляем трек - ДОПИСАТЬ ПОТОМУ ЧТО УДАЛЯЕТСЯ ТОЛЬКО ПЕСНЯ ИЗ БД А НА ДИСКЕ ОСТАЕТСЯ
router.delete('/:id', (req, res) => {
    db.prepare('DELETE FROM tracks WHERE id = ?').run(req.params.id)
    res.json({ message: 'Трек удалён' })
})

// router.delete('/:id/dislike', (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1]
//     if (!token) return res.status(401).json({ error: 'Нет токена' })
//     const jwt = require('jsonwebtoken')
//     const decoded = jwt.verify(token, process.env.SECRET)
//     const userId = decoded.id
//     db.prepare(
//         'DELETE FROM disliked_tracks WHERE user_id = ? AND track_id = ?'
//     ).run(userId, req.params.id)

//     res.json({ message: 'Убрано из дизлайков' })
// })


// звездочки(rating)
// поставить оценку
router.post('/:id/rate', (req, res) => {
    const { rating } = req.body
    const track_id = req.params.id
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Нет токена' })
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.SECRET)
    const user_id = decoded.id
    // INSERT OR REPLACE - если оценка уже есть то обновляем
    db.prepare(`
        INSERT INTO ratings (user_id, track_id, rating)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, track_id) DO UPDATE SET rating = ?
    `).run(user_id, track_id, rating, rating)
    // считаем средний рейтинг
    const avg = db.prepare('SELECT AVG(rating) as avg FROM ratings WHERE track_id = ?').get(track_id)
    res.json({ rating, avg: Math.round(avg.avg * 10) / 10 })
})


// получить свою оценку
router.get('/:id/rate', (req, res) => {
    const track_id = req.params.id
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ rating: 0 })
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.SECRET)
    const user_id = decoded.id
    const rating = db.prepare('SELECT rating FROM ratings WHERE user_id = ? AND track_id = ?').get(user_id, track_id)
    const avg = db.prepare('SELECT AVG(rating) as avg FROM ratings WHERE track_id = ?').get(track_id)
    res.json({ 
        rating: rating ? rating.rating : 0,
        avg: avg.avg ? Math.round(avg.avg * 10) / 10 : 0
    })
})


//новый роутер с галочкой для поиска треков
router.get('/search', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const jwt = require('jsonwebtoken')
    //заменили строчку с токеном
    const decoded = jwt.verify(token, process.env.SECRET)
    const userId = decoded.id
    // все треки + флаг есть ли в библиотеке пользователя
    const tracks = db.prepare(`
        SELECT tracks.*, 
        CASE WHEN user_library.id IS NOT NULL THEN 1 ELSE 0 END as inLibrary
        FROM tracks
        LEFT JOIN user_library 
        ON tracks.id = user_library.track_id AND user_library.user_id = ?
    `).all(userId)

    res.json(tracks)
})

//новые роутеры для топ 5 на главной странице
// топ 5 популярных треков
router.get('/top', (req, res) => {
    const tracks = db.prepare(`
        SELECT tracks.*, 
        AVG(ratings.rating) as avg_rating,
        COUNT(ratings.id) as rating_count
        FROM tracks
        LEFT JOIN ratings ON tracks.id = ratings.track_id
        GROUP BY tracks.id
        HAVING rating_count > 0
        ORDER BY avg_rating DESC
        LIMIT 5
    `).all()
    res.json(tracks)
})


// 5 последних добавленных треков
router.get('/recent', (req, res) => {
    const tracks = db.prepare(
        'SELECT * FROM tracks ORDER BY id DESC LIMIT 5'
    ).all()
    res.json(tracks)
})


// dislike
router.delete('/undislike/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Нет токена' })
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.SECRET)
    const userId = decoded.id
    // проверяем уже дизлайкнул?
    const existing = db.prepare(
        'SELECT * FROM disliked_tracks WHERE user_id = ? AND track_id = ?'
    ).get(userId, id)
    if (existing) return res.json({ alreadyDisliked: true })
    // добавляем в дизлайки
    db.prepare(
        'INSERT INTO disliked_tracks (user_id, track_id) VALUES (?,?)'
    ).run(userId, id)
    res.json({ alreadyDisliked: false })
})


// получить дизлайкнутые треки пользователя
router.get('/disliked', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Нет токена' })
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.SECRET)
    const userId = decoded.id
    const tracks = db.prepare(`
        SELECT tracks.* FROM tracks
        JOIN disliked_tracks ON tracks.id = disliked_tracks.track_id
        WHERE disliked_tracks.user_id = ?
    `).all(userId)
    res.json(tracks)
})
//делаем доступный роутер для server.js
module.exports = router