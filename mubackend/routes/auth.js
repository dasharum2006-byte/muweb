//подключаем все нужное 
const express = require('express')
const router = express.Router()
const db = require('../db/database')
// jwt - создает токены
const jwt = require('jsonwebtoken')
// bcrypt - шифрует пароли
const bcrypt = require('bcrypt')

// секретное слово для токена - фиг вы меня взломаете бебебе
const SECRET = process.env.SECRET

//регистрация для пользователя
router.post('/register', async (req, res) => {
    const { login, name, password } = req.body

    if (!login || !name || !password) {
        return res.status(400).json({ error: 'Заполните все поля' })
    }

    // проверяем что логин не занят
    const existing = db.prepare('SELECT * FROM users WHERE login = ?').get(login)
    if (existing) {
        return res.status(400).json({ error: 'Логин уже занят' })
    }

    // шифруем пароль - 10 это сложность шифрования
    const hashedPassword = await bcrypt.hash(password, 10)

    // сохраняем пользователя
    db.prepare('INSERT INTO users (login, name, password) VALUES (?, ?, ?)')
        .run(login, name, hashedPassword)

    res.json({ message: 'Регистрация прошла успешно' })
})

//вход 
router.post('/login', async (req, res) => {
    const { login, password } = req.body

    if (!login || !password) {
        return res.status(400).json({ error: 'Заполните все поля' })
    }
    // ищем пользователя в базе
    const user = db.prepare('SELECT * FROM users WHERE login = ?').get(login)
    if (!user) {
        return res.status(400).json({ error: 'Неверный логин или пароль' })
    }

    // проверяем пароль
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Неверный логин или пароль' })
    }
    // создаем токен
    const token = jwt.sign(
        { id: user.id, login: user.login, name: user.name },
        SECRET,
        { expiresIn: '7d' }  // токен живет 7 дней
    )

    res.json({ token, name: user.name })
})
module.exports = router