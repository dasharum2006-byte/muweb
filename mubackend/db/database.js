//мы называем инструмент DataBase require (возьми этот инструмент),
//better-sqlite3 - название инструмента(мы тип скачали программу для работы с базой данных и дали ей название Database)
const DataBase = require('better-sqlite3')
//интсрумент знает как правильно склеивать название папок чтобы база данных сохранилась в нужную папку а не потерялась где то на диске 
const path = require('path')
//создаем файл базы данных
//__dirname	Магическая переменная, которая означает текущая папка, где лежит ваш скрипт
//'music.db'	Имя файла, в котором будет храниться база данных
//path.join(...)	Склеивает путь: текущая_папка + music.db
const db = new DataBase(path.join(__dirname, 'music.db'))

//table for user - login and password
//по приколу знать когда пользователь зарегался
db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT null,
    name TEXT NOT null,
    password TEXT NOT null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)
//таблица треков
db.exec(`
    CREATE TABLE IF NOT EXISTS tracks 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT null,
        artist TEXT NOT null,
        filename TEXT NOT null,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        cover TEXT DEFAULT NULL
    )
`)
//создаем таблицу плейлистов
db.exec(`
    CREATE TABLE IF NOT EXISTS playlists(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`)
//создаем таблицу связи плейлист - трек
db.exec(`
    CREATE TABLE IF NOT EXISTS playlist_tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id INTEGER,
        track_id INTEGER
    )
`)
//unique - чтобы один пользователь мог поставить только одну оценку треку,
//если поставит снова то обновиться
db.exec(`
    CREATE TABLE IF NOT EXISTS ratings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGET NOT null,
    track_id INTEGER NOT null,
    rating INTEGER NOT null,
    UNIQUE(user_id, track_id)
    )`)
    //бд для галочки что у пользователя уже загружен трек
db.exec(`
    CREATE TABLE IF NOT EXISTS user_library (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        track_id INTEGER NOT NULL,
        UNIQUE(user_id, track_id)
    )
`)
//база данных для артистов
db.exec(`
    CREATE TABLE IF NOT EXISTS artists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        photo TEXT
    )
`)
db.exec(`
    CREATE TABLE IF NOT EXISTS track_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        track_id INTEGER NOT NULL,
        UNIQUE(user_id, track_id)
    )
`)
db.exec(`
    CREATE TABLE IF NOT EXISTS disliked_tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        track_id INTEGER NOT NULL,
        UNIQUE(user_id, track_id)
    )
`)
// отдаем нашу базу данных
module.exports = db