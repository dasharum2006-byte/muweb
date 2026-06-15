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
//таблица треков
db.exec(`
    CREATE TABLE IF NOT EXISTS tracks 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT null,
        artist TEXT NOT null,
        filename TEXT NOT null,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0
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
// отдаем нашу базу данных
module.exports = db