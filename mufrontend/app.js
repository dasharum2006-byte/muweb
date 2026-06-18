// когда страница загрузилась  - сразу загружаем треки
//document - all web page, .addEventListener - listen event - wait when something happend
// DOMContentLoaded - event - all page loaded(HTML,CSS)
document.addEventListener('DOMContentLoaded', () => {
    showPage('home') // показываем главную по умолчанию
})
// запоминаем какой трек сейчас играет
let currentTrackId = null
//добавляем переменную для обложки
let currentCover = null
//защита
// проверяем есть ли токен - если нет то на страницу входа
const token = localStorage.getItem('token')
if (!token) {
    window.location.href = 'login.html'
}

// достаем имя пользователя
const userName = localStorage.getItem('name')
////
//addEventListener — это часть Web API (Application Programming Interface).
//Web API — это набор готовых функций, которые браузер даёт разработчикам:
//Функция	Что делает
//document.getElementById()	Найти элемент на странице
//fetch()	Сходить на сервер
//addEventListener()	Подождать событие
//console.log()	Напечатать в консоль
//Все эти функции нельзя менять — они встроены в браузер.
////
function loadTracks() {
// go to my server and  get data
    fetch('http://localhost:3000/tracks')
    //then - когда данные придут то ответ от сервера преврати из формата json to java script - распаковывем данные
        .then(res => res.json())
        //переменная в которую попали превращенные данные - массив песен и мы их используем
        .then(tracks => {
            //добавляем для плеера кастомного
            tracksList = tracks 
            //сюда мы будем класть треки
            const list = document.getElementById('tracks-list')
            //очищаем коробку - чтобы треки не дублировались при повторной загрузке
            list.innerHTML = ''
        //проверяем есть ли песни, === - строго равно
            if (tracks.length === 0){
                //list - контейнер как полка в шкафу куда мы кладем песни,Робот берет нашу пустую полку (list) и вешает на неё табличку с надписью: "Треков пока нет".
                list.innerHTML = '<p>Треков пока нет</p>'
                //Робот сказал "песен нет", вывел сообщение и ушел. Он не будет пытаться показывать песни, которых нет.
                return
            }
            //мы получаем ответ от сервера,который мы превратили в массив
            //Для КАЖДОГО трека из списка делаем одно и то же действие
            //!!!!Добавили карточку трека 
            //Добавила + к треку чобы можно было добавить в плейлист
            //<div class="playlist-menu" id="playlist-menu-${currentsong.id}" style="display:none"></div> ----
            //Это контейнер для выпадающего меню с плейлистами.Это контейнер для выпадающего меню с плейлистами.
//Когда нажимаешь кнопку + — функция togglePlaylistMenu ищет этот контейнер по id и показывает внутри него список плейлистов.
            tracks.forEach(currentsong => {
                //Для каждой песни создаём карточку в HTML и кидаем её в коробку. += значит "добавь к тому что уже есть", а не замени. ${} — это способ вставить переменную внутрь текста.
                list.innerHTML += `
                <div class="track-card">
                <div class="track-info">
                            <span class="track-title">${currentsong.title}</span>
                            <span class="track-artist">${currentsong.artist}</span>
                        </div>
                        <div class="track-buttons">
                            <button onclick="playTrack('${currentsong.filename}', '${currentsong.title}', '${currentsong.artist}', ${currentsong.id}, '${currentsong.cover}')">▶ Играть</button>
                            <button onclick="likeTrack(${currentsong.id}, this)">❤ ${currentsong.likes}</button>
                                  <button class="add-to-playlist-btn" onclick="togglePlaylistMenu(${currentsong.id}, this)">+</button>
                        </div>
                               <div class="playlist-menu" id="playlist-menu-${currentsong.id}" style="display:none"></div>
                    </div>`
            })
            //onclick — это значит "когда кликнули на эту кнопку — вызови функцию".
//playTrack(...) — функция которую мы напишем в app.js. Ей нужно знать ЧТО играть, поэтому передаём три вещи:
//currentsong.filename — имя файла например 1234567.mp3 чтобы найти его на сервере
//currentsong.title — название трека чтобы показать в плеере
//currentsong.artist — имя артиста чтобы показать в плеере
        })
        //this — это ссылка на саму кнопку которую нажали.
//Представь у тебя 10 треков и у каждого своя кнопка лайка. Когда ты нажимаешь лайк на треке №3 — как функция узнает КАКУЮ кнопку обновить чтобы показать новое число лайков?
//Вот для этого и нужен this — он говорит функции "вот та самая кнопка которую только что нажали, обнови именно её":
}

//воспроизвести трек
function playTrack(filename, title, artist, id, cover) {
    //обновляем индекс для кастомноо плеера
    currentTrackIndex = tracksList.findIndex(t => t.id === id)
    //получаем доступ к элементам на странице
    //	Объяснение для робота
    //const player	Робот создает ящик с надписью "player" и кладет туда то, что найдет.
    //document.getElementById	Робот идет в HTML-код страницы и ищет элемент с ID равным audio-player.
    //'audio-player'	Это уникальное имя тега <audio> на странице
    currentTrackId = id //запоминаем id трека
    //добавляем сохранение обложки
    currentCover = cover
    const player = document.getElementById('audio-player')
    //находим место для названия песни
    const currentTitle = document.getElementById('current-title')
    const currentArtist = document.getElementById('current-artist')
    //добавили обложку !!!!!!!!!!!!
    const coverImage = document.getElementById('cover-image')

    //!!!!!!!!!!!
    if (cover && cover !== 'null') {
    // обложка есть — показываем её
    coverImage.src = `http://localhost:3000/uploads/covers/${cover}`
} else {
    // обложки нет — показываем пингвина
    coverImage.src = 'images/penguin-logo.png'
}
        //!!!!!!!!!1
    //загружаем нужный файл в плеер
    player.src = `http://localhost:3000/uploads/${filename}`
    //меняем текст на текущую песню
    //Это значит: "Возьми исполнителя из посылки (artist) и напиши его на табличке (currentArtist.textContent)"
    currentTitle.textContent = title
    currentArtist.textContent = artist
    player.play()
}

function likeTrack(id, button) {
    fetch(`http://localhost:3000/tracks/${id}/like`, {method: 'POST'})
        .then(res => res.json())
        .then(data => {
            button.textContent = `❤ ${data.likes}`
            //чтобы сначала она была серая а потом красная
            button.classList.add('liked') 
        })
}

function uploadTrack() {
    const title = document.getElementById('track-title').value
    const artist = document.getElementById('track-artist').value
    //добавили обложку для трека!!!!!!!!!
    const cover = document.getElementById('track-cover').value
    const file = document.getElementById('track-file').files[0]

    if (!title || !artist || !file) {
        alert('Заполните все поля')
        return
    }
//добавила cover 
    const formData = new FormData()
    formData.append('title', title)
    formData.append('artist', artist)
    formData.append('cover', cover)  
    formData.append('audio', file)

    fetch('http://localhost:3000/tracks/upload', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            alert('Трек загружен')
            loadTracks()
        })
}

function loadPlaylists() {
    fetch('http://localhost:3000/playlists')
        .then(res => res.json())
        .then(playlists => {
            const list = document.getElementById('playlists-list')
            list.innerHTML = ''

            if (playlists.length === 0) {
                list.innerHTML = '<p>Плейлистов пока нет</p>'
                return
            }
            //изменила
            playlists.forEach(playlist => {
                list.innerHTML += `
                    <div class="playlist-card" onclick="openPlaylist(${playlist.id}, '${playlist.name}')">
                        📁 ${playlist.name}
                    </div>
                    `
                })
        })
}

function createPlaylist() {
    const name = document.getElementById('playlist-name').value

    if (!name) {
        alert('Введи название плейлиста')
        return
    }

    fetch('http://localhost:3000/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(res => res.json())
        .then(() => {
            document.getElementById('playlist-name').value = ''
            loadPlaylists()
        })
}

function showPage(name, btn) {
    // прячем все страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'))
    // показываем нужную
    document.getElementById('page-' + name).classList.add('active-page')
    // убираем active со всех кнопок меню
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
    // ставим active на нажатую кнопку
    if (btn) btn.classList.add('active')
    // загружаем данные для нужной страницы
    // прячем плеер на странице настроек
    const rightColumn = document.querySelector('.right-column')
    if (name === 'settings') {
        rightColumn.style.display = 'none'
    } else {
        rightColumn.style.display = 'flex'
    }
    if (name === 'music') {
        loadTracks()
    }
    if (name === 'playlists') {
        loadPlaylists()
    }
    if (name === 'settings') {
        loadProfile()
}
}

//функция выхода 
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    window.location.href = 'login.html'
}

//Добавила новые функции две для трека чтобы можно было загружать их в плейлист
function togglePlaylistMenu(trackId, btn) {
    const menu = document.getElementById('playlist-menu-' + trackId)
    
    // если меню уже открыто - закрываем
    if (menu.style.display === 'block') {
        menu.style.display = 'none'
        return
    }

    // загружаем плейлисты и показываем меню
    fetch('http://localhost:3000/playlists')
        .then(res => res.json())
        .then(playlists => {
            menu.innerHTML = ''
//добавили время
            if (playlists.length === 0) {
                menu.innerHTML = '<p>Сначала создай плейлист</p>'
                menu.style.display = 'block'
            // через 2 секунды прячем
                setTimeout(() => {
                    menu.style.display = 'none'
                }, 2000)
            }else {
                playlists.forEach(playlist => {
                    menu.innerHTML += `
                        <div class="playlist-menu-item" onclick="addToPlaylist(${trackId}, ${playlist.id}, '${playlist.name}')">
                            📁 ${playlist.name}
                        </div>
                    `
                })
            }
            menu.style.display = 'block'
        })
}

function addToPlaylist(trackId, playlistId, playlistName) {
    fetch(`http://localhost:3000/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId })
    })
        //изменила - добавила проверку на то что трек уже есть в плейлисте
        .then(data => {
            if (data.error) {
                alert(data.error)  // ← покажет "Трек уже в плейлисте!"
            } else {
                alert(`Добавлено в "${playlistName}"!`)
            }
            document.getElementById('playlist-menu-' + trackId).style.display = 'none'
        })
}
//функция открытия плейлиста
function openPlaylist(id, name) {
    fetch(`http://localhost:3000/playlists/${id}/tracks`)
        .then(res => res.json())
        .then(tracks => {
            // ищем контейнер для треков плейлиста или создаём
            let container = document.getElementById('open-playlist-' + id)
            
            if (container) {
                // если уже открыт - закрываем
                container.remove()
                return
            }

            container = document.createElement('div')
            container.id = 'open-playlist-' + id
            container.className = 'open-playlist'
            container.innerHTML = `<h3>📁 ${name}</h3>`

            if (tracks.length === 0) {
                container.innerHTML += '<p>Плейлист пустой</p>'
            } else {
                tracks.forEach(track => {
                    container.innerHTML += `
                        <div class="track-card">
                            <div class="track-info">
                                <span class="track-title">${track.title}</span>
                                <span class="track-artist">${track.artist}</span>
                            </div>
                            <div class="track-buttons">
                                <button onclick="playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶ Играть</button>
                            </div>
                        </div>
                    `
                })
            }

            // добавляем после списка плейлистов
            document.getElementById('playlists-list').after(container)
        })
}
//Новые функции для настроек - аватар, смена тем
function setTheme(name) {
    // убираем active со всех карточек
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'))
    // ставим active на выбранную
    event.target.closest('.theme-card').classList.add('active')

    // сохраняем тему
    localStorage.setItem('theme', name)
    applyTheme(name)
}

function applyTheme(name) {
    const root = document.documentElement

    if (name === 'pink') {
        root.style.setProperty('--bg', '#fdf0f5')
        root.style.setProperty('--accent', '#e07090')
        root.style.setProperty('--accent-hover', '#c2678a')
        root.style.setProperty('--border', '#f4c2d8')
        root.style.setProperty('--sidebar-bg', '#fff0f5')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--card-inner', '#fff5f9')
        root.style.setProperty('--text', '#3a2a35')
        root.style.setProperty('--text-secondary', '#b89aaa')
        root.style.setProperty('--heading', '#c2678a')
    } else if (name === 'purple') {
        root.style.setProperty('--bg', '#f5f0ff')
        root.style.setProperty('--accent', '#9b7fd4')
        root.style.setProperty('--accent-hover', '#7a5cb8')
        root.style.setProperty('--border', '#d4c5f9')
        root.style.setProperty('--sidebar-bg', '#ede6ff')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--card-inner', '#f5f0ff')
        root.style.setProperty('--text', '#2a1a3a')
        root.style.setProperty('--text-secondary', '#9b7fd4')
        root.style.setProperty('--heading', '#7a5cb8')
    } else if (name === 'blue') {
        root.style.setProperty('--bg', '#f0f7ff')
        root.style.setProperty('--accent', '#5b9bd5')
        root.style.setProperty('--accent-hover', '#3a7ab8')
        root.style.setProperty('--border', '#b8d8f4')
        root.style.setProperty('--sidebar-bg', '#e6f4ff')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--card-inner', '#f0f7ff')
        root.style.setProperty('--text', '#1a2a3a')
        root.style.setProperty('--text-secondary', '#5b9bd5')
        root.style.setProperty('--heading', '#3a7ab8')
    } else if (name === 'dark') {
        root.style.setProperty('--bg', '#1a1a2e')
        root.style.setProperty('--accent', '#b2bbc088')
        root.style.setProperty('--accent-hover', '#9db9cf')
        root.style.setProperty('--border', '#adadb8')
        root.style.setProperty('--sidebar-bg', '#16213e')
        root.style.setProperty('--card-bg', '#0f3460')
        root.style.setProperty('--card-inner', '#16213e')
        root.style.setProperty('--text', '#ffffff')
        root.style.setProperty('--text-secondary', '#aaaacc')
        root.style.setProperty('--heading', '#7e9bf8')
    }
}

function uploadAvatar(input) {
    const file = input.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const preview = document.getElementById('avatar-preview')
        preview.innerHTML = `<img src="${e.target.result}" alt="аватар">`
        localStorage.setItem('avatar', e.target.result)
    }
    reader.readAsDataURL(file)
}

// применяем тему и аватарку при загрузке
const savedTheme = localStorage.getItem('theme')
if (savedTheme) applyTheme(savedTheme)

const savedAvatar = localStorage.getItem('avatar')
if (savedAvatar) {
    const preview = document.getElementById('avatar-preview')
    if (preview) preview.innerHTML = `<img src="${savedAvatar}" alt="аватар">`
}
// функция смена пароля и показ профиля в настройках
// показываем логин и имя в настройках
function loadProfile() {
    const login = localStorage.getItem('login')
    const name = localStorage.getItem('name')
    const loginEl = document.getElementById('profile-login')
    const nameEl = document.getElementById('profile-name')
    if (loginEl) loginEl.textContent = '👤 ' + (login || '')
    if (nameEl) nameEl.textContent = '🎵 ' + (name || '')
}

async function changePassword() {
    const oldPassword = document.getElementById('old-password').value
    const newPassword = document.getElementById('new-password').value
    const msg = document.getElementById('password-msg')

    if (!oldPassword || !newPassword) {
        msg.textContent = 'Заполните оба поля!'
        return
    }

    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ oldPassword, newPassword })
    })

    const data = await res.json()
    if (!res.ok) {
        msg.style.color = '#e07090'
        msg.textContent = data.error
    } else {
        msg.style.color = '#4caf50'
        msg.textContent = 'Пароль успешно изменён!'
        document.getElementById('old-password').value = ''
        document.getElementById('new-password').value = ''
    }
}
//функции для cover
let playerView = 'default'
let blobs = []
let animFrame = null

function togglePlayerView() {
    const cover = document.getElementById('cover-image')
    const canvas = document.getElementById('blob-canvas')

    if (playerView === 'default') {
        playerView = 'cover'
        cover.style.display = 'block'
        canvas.style.display = 'none'
        cover.src = currentCover && currentCover !== 'null'
            ? `http://localhost:3000/uploads/covers/${currentCover}`
            : 'images/penguin-logo.png'
    } else if (playerView === 'cover') {
        playerView = 'blobs'
        cover.style.display = 'none'
        canvas.style.display = 'block'
        startBlobs(canvas)

    } else {
        playerView = 'default'
        cover.style.display = 'block'
        canvas.style.display = 'none'
        cover.src = 'images/penguin-logo.png'
        stopBlobs()
    }
}

//блобс - размытые пятна
function startBlobs(canvas) {
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetWidth

    blobs = []
    const colors = [
        ['#fffd9d', '#e77bde'],
        ['#c77dff', '#d218f3'],
        ['#4fc3f7', '#3462eb'],
        ['#ff6eb4', '#ff9de2'],
        ['#a78bfa', '#60a5fa'],
    ]

    for (let i = 0; i < 5; i++) {
        blobs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 70 + Math.random() * 60,
            dx: (Math.random() - 0.5) * 1.2,
            dy: (Math.random() - 0.5) * 1.2,
            colors: colors[i],
            // точки для неправильной формы
            points: Array.from({length: 8}, (_, i) => ({
                angle: (i / 8) * Math.PI * 2,
                radius: 0.7 + Math.random() * 0.3,
                speed: 0.01 + Math.random() * 0.02,
                offset: Math.random() * Math.PI * 2
            }))
        })
    }

    let time = 0

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // белый фон
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // размытие
        ctx.filter = 'blur(5px)'

        blobs.forEach(blob => {
            blob.x += blob.dx
            blob.y += blob.dy

            if (blob.x < blob.r || blob.x > canvas.width - blob.r) blob.dx *= -1
            if (blob.y < blob.r || blob.y > canvas.height - blob.r) blob.dy *= -1

            // рисуем неправильную форму
            const gradient = ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.r
            )
            gradient.addColorStop(0, blob.colors[0] + 'ee')
            gradient.addColorStop(1, blob.colors[1] + '00')

            ctx.beginPath()
            blob.points.forEach((point, i) => {
                const r = blob.r * (point.radius + 0.2 * Math.sin(time * point.speed + point.offset))
                const x = blob.x + r * Math.cos(point.angle)
                const y = blob.y + r * Math.sin(point.angle)
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            })
            ctx.closePath()
            ctx.fillStyle = gradient
            ctx.fill()
        })

        ctx.filter = 'none'
        time++
        animFrame = requestAnimationFrame(draw)
    }

    draw()
}
function stopBlobs() {
    if (animFrame) {
        cancelAnimationFrame(animFrame)
        animFrame = null
    }
}

//Кастомный плеер
// обновляем ползунок каждую секунду
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-player')

    audio.addEventListener('timeupdate', () => {
        const current = audio.currentTime
        const total = audio.duration || 0
        const percent = total ? (current / total) * 100 : 0

        document.getElementById('progress-fill').style.width = percent + '%'
        document.getElementById('progress-dot').style.left = percent + '%'
        document.getElementById('current-time').textContent = formatTime(current)
        document.getElementById('total-time').textContent = formatTime(total)
    })

    audio.addEventListener('play', () => {
        document.getElementById('play-btn').textContent = '⏸'
    })

    audio.addEventListener('pause', () => {
        document.getElementById('play-btn').textContent = '▶'
    })
})

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return m + ':' + (s < 10 ? '0' + s : s)
}

function togglePlay() {
    const audio = document.getElementById('audio-player')
    if (audio.paused) {
        audio.play()
    } else {
        audio.pause()
    }
}

function seekAudio(event) {
    const audio = document.getElementById('audio-player')
    const bar = event.currentTarget
    const rect = bar.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    audio.currentTime = percent * audio.duration
}

// список треков для переключения
let tracksList = []
let currentTrackIndex = 0

function prevTrack() {
    if (tracksList.length === 0) return
    currentTrackIndex = (currentTrackIndex - 1 + tracksList.length) % tracksList.length
    const track = tracksList[currentTrackIndex]
    playTrack(track.filename, track.title, track.artist, track.id, track.cover)
}

function nextTrack() {
    if (tracksList.length === 0) return
    currentTrackIndex = (currentTrackIndex + 1) % tracksList.length
    const track = tracksList[currentTrackIndex]
    playTrack(track.filename, track.title, track.artist, track.id, track.cover)
}