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

// регистрация с секретным словом
router.post('/register', async (req, res) => {
    const { login, name, password, secretWord } = req.body

    if (!login || !name || !password || !secretWord) {
        return res.status(400).json({ error: 'Заполните все поля' })
    }

    const existing = db.prepare('SELECT * FROM users WHERE login = ?').get(login)
    if (existing) {
        return res.status(400).json({ error: 'Логин уже занят' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const hashedSecret = await bcrypt.hash(secretWord, 10)

    db.prepare('INSERT INTO users (login, name, password, secret_word) VALUES (?, ?, ?, ?)')
        .run(login, name, hashedPassword, hashedSecret)

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

    res.json({ token, name: user.name, login: user.login })
})

// восстановление пароля через секретное слово
router.post('/recover-password', async (req, res) => {
    const { login, secretWord, newPassword } = req.body

    if (!login || !secretWord || !newPassword) {
        return res.status(400).json({ error: 'Заполните все поля' })
    }

    const user = db.prepare('SELECT * FROM users WHERE login = ?').get(login)
    if (!user) {
        return res.status(400).json({ error: 'Пользователь не найден' })
    }

    // проверяем секретное слово
    const isSecretCorrect = await bcrypt.compare(secretWord, user.secret_word)
    if (!isSecretCorrect) {
        return res.status(400).json({ error: 'Неверное секретное слово' })
    }

    // обновляем пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id)

    res.json({ message: 'Пароль успешно изменён' })
})

router.post('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) return res.status(401).json({ error: 'Нет токена' })

    const jwt = require('jsonwebtoken')
    const SECRET = process.env.SECRET

    try {
        const decoded = jwt.verify(token, SECRET)
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id)

        const isCorrect = await bcrypt.compare(oldPassword, user.password)
        if (!isCorrect) return res.status(400).json({ error: 'Неверный старый пароль' })

        const hashed = await bcrypt.hash(newPassword, 10)
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, user.id)

        res.json({ message: 'Пароль изменён' })
    } catch {
        res.status(401).json({ error: 'Неверный токен' })
    }
})
module.exports = router