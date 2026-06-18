// переключение вкладок
function showTab(name) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-tab'))
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
    document.getElementById('tab-' + name).classList.add('active-tab')
    event.target.classList.add('active')
}

// регистрация
async function register() {
    const login = document.getElementById('reg-login').value
    const name = document.getElementById('reg-name').value
    const password = document.getElementById('reg-password').value
    const errorMsg = document.getElementById('reg-error')

    const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, name, password })
    })

    const data = await res.json()

    if (!res.ok) {
        errorMsg.textContent = data.error
        return
    }

    errorMsg.style.color = '#4c7aaf'
    errorMsg.textContent = 'Успешно! Теперь войди в аккаунт'
}

// вход
async function login() {
    const login = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value
    const errorMsg = document.getElementById('login-error')

    const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
    })

    const data = await res.json()

    if (!res.ok) {
        errorMsg.textContent = data.error
        return
    }

    // сохраняем токен в браузере
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.name)

    // переходим на главную страницу
    window.location.href = 'index.html'
}

// если токен уже есть - сразу на главную
if (localStorage.getItem('token')) {
    window.location.href = 'index.html'
}