// когда страница загрузилась  - сразу загружаем треки
//document - all web page, .addEventListener - listen event - wait when something happend
// DOMContentLoaded - event - all page loaded(HTML,CSS)
document.addEventListener('DOMContentLoaded', () => {
    const lastPage = localStorage.getItem('currentPage') || 'home'
    showPage(lastPage)
    loadHomePage()
})
// запоминаем какой трек сейчас играет
let currentTrackId = null//добавляем переменную для обложки
let currentCover = null//для поиска
let tracksList = []//защита// проверяем есть ли токен - если нет то на страницу входа
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
const token = localStorage.getItem('token')
    fetch('http://localhost:3000/tracks', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
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
                list.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem; padding: 10px;">Треков пока нет</p>'
                //Робот сказал "песен нет", вывел сообщение и ушел. Он не будет пытаться показывать песни, которых нет.
                return
            }
            tracks.forEach(track => {
            list.innerHTML += `
            <div class="playlist-track-row" data-track-id="${track.id}">
            <div class="track-info-block">
                <span class="track-title">${track.title}</span>
                <span class="track-artist">${track.artist}</span>
            </div>
            <div class="track-actions-row-block">
    <button class="add-to-playlist-circle-btn" onclick="togglePlaylistMenu(${track.id}, this)">+</button>
    <button class="play-icon-btn" data-track-id="${track.id}" onclick="playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶</button>
    <button class="delete-track-btn" onclick="deleteTrack(${track.id})">🗑️</button>
</div>
    </div>
`

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


// Воспроизвести трек (Обновленная версия)
function playTrack(filename, title, artist, id, cover) {
    const player = document.getElementById('audio-player')
    const trackData = tracksList.find(t => t.id === id)
    const isLiked = trackData ? trackData.is_liked : false 
    // Если кликнули на тот же самый трек, который уже играет или на паузе
    if (currentTrackId === id) {
        if (player.paused) {
            player.play().catch(err => console.log('Прервано')) // Если стоял на паузе — запускаем
        } else {
            player.pause(); // Если играл — ставим на паузу
        }
        return; // Выходим из функции, чтобы не загружать файл заново
    }
    //обновляем индекс для кастомноо плеера
    currentTrackIndex = tracksList.findIndex(t => t.id === id)
    //получаем доступ к элементам на странице
    //Объяснение для робота
    //const player	Робот создает ящик с надписью "player" и кладет туда то, что найдет.
    //document.getElementById	Робот идет в HTML-код страницы и ищет элемент с ID равным audio-player.
    //'audio-player'	Это уникальное имя тега <audio> на странице
    currentTrackId = id //запоминаем id трека
    //добавляем сохранение обложки
    currentCover = cover
    //находим место для названия песни
    const currentTitle = document.getElementById('current-title')
    const currentArtist = document.getElementById('current-artist')
    //добавили обложку
    const coverImage = document.getElementById('cover-image')
    if (cover && cover !== 'null') {
    // обложка есть — показываем её
        coverImage.src = `http://localhost:3000/uploads/covers/${cover}`
    } else {
    // обложки нет — показываем пингвина
        coverImage.src = 'images/penguin-logo.png'
    }
        //загружаем нужный файл в плеер
        player.src = `http://localhost:3000/uploads/${filename}`
      // меняем текст на текущую песню
    if (currentTitle) currentTitle.textContent = title
    if (currentArtist) currentArtist.textContent = artist
    
    // Сбрасываем старые подсветки кнопок в плеере
    const track = tracksList.find(t => t.id === id)
    const likeBtn = document.querySelector('.like-btn')
    const dislikeBtn = document.querySelector('.dislike-btn')
    if (likeBtn) likeBtn.classList.toggle('liked', !!track?.is_liked)
    if (dislikeBtn) dislikeBtn.classList.toggle('disliked', !!track?.is_disliked)
    if (likeBtn) likeBtn.classList.remove('liked')
    if (dislikeBtn) dislikeBtn.classList.remove('disliked')
    
    // 2. Убрали повторное const, просто проверяем уже созданную переменную trackData
    if (trackData) {
        if (trackData.is_liked && likeBtn) likeBtn.classList.add('liked')
        if (trackData.is_disliked && dislikeBtn) dislikeBtn.classList.add('disliked')
    }
    updateBottomPlayer(title, artist, isLiked)
    // Синхронизируем все play-кнопки — ставим "играет"
    syncAllPlayButtons(!player.paused)
    // Запускаем

    player.play().catch(err => {
        console.log('Загрузка прервана:', err.message)

    })

}

//Обновление кнопок плей и пауза
// Ждем, пока робот загрузит страницу, находит плеер и следит за ним
document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('audio-player')
    
    if (player) {
        // Если плеер запел или встал на паузу — запускаем пересчет кнопок
        player.addEventListener('play', updatePlayButtons)
        player.addEventListener('pause', updatePlayButtons)
        player.addEventListener('ended', () => {
            currentTrackId = null // Трек закончился — сбрасываем ID
            updatePlayButtons()
        });
    }
});

// Функция, которая пробегается по сайту и меняет  играть на стоп у нужной песни
function updatePlayButtons() {
    const player = document.getElementById('audio-player')
    const allPlayButtons = document.querySelectorAll('.play-icon-btn, .fav-play-btn, .search-play-btn')

    allPlayButtons.forEach(btn => {
        const btnTrackId = btn.dataset.trackId ? parseInt(btn.dataset.trackId) : null

        if (btnTrackId === currentTrackId && !player.paused) {
            btn.innerHTML = '⏸'
            btn.classList.add('is-playing')
        } else {
            btn.innerHTML = '▶'
            btn.classList.remove('is-playing')
        }
    })

    // Нижний и главный плеер
    const bpPlayBtn = document.getElementById('bp-play-btn')
    const mainPlayBtn = document.getElementById('play-btn')
    const icon = player.paused ? '▶' : '⏸'
    if (bpPlayBtn) bpPlayBtn.textContent = icon
    if (mainPlayBtn) mainPlayBtn.textContent = icon
}


function likeTrack() {
    if (!currentTrackId) return
    const token = localStorage.getItem('token')
    const likeBtn = document.querySelector('.like-btn')
    const dislikeBtn = document.querySelector('.dislike-btn')

    fetch(`http://localhost:3000/tracks/like/${currentTrackId}`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => res.json())
        .then(data => {
    if (data.alreadyLiked) return
    likeBtn.classList.add('liked')
    const dislikeBtn = document.querySelector('.dislike-btn')
    if (dislikeBtn) dislikeBtn.classList.remove('disliked')
    const track = tracksList.find(t => t.id === currentTrackId)
    if (track) { track.is_liked = true; track.is_disliked = false }
    // обновляем страницу любимое если открыта
    const favPage = document.getElementById('page-favorites')
    if (favPage && favPage.classList.contains('active-page')) {
        loadFavorites()
    }
})
}
function uploadTrack() {
    const title = document.getElementById('track-title').value
    const artist = document.getElementById('track-artist').value
    //добавили обложку для трека!!!!!!!!!
    const cover = document.getElementById('track-cover-name').value
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
    //add new stroke чтобы токен не получал пустой токен и падал
    const token = localStorage.getItem('token') 
        fetch('http://localhost:3000/tracks/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            // Если бэкенд вернул ошибку про дубликат
            if (data.error) {
                alert(data.error) // Выведет: "Этот трек уже есть в вашей медиатеке!"
                return // Выходим из функции, списки обновлять не нужно
            }
            // Если всё прошло успешно
            alert('Трек загружен')
            // 1. Обновляет список "Все треки" на странице музыки
            loadTracks()
            // 2. ДОБАВЛЯЕМ СЮДА: мгновенно обновляет "Недавно добавленные" и Топ-5 на главной
            loadHomePage()
        }).catch(err => console.error('Ошибка отправки формы', err))
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
                        ${playlist.name}
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
    // БЕЗОПАСНЫЙ ПОКАЗ: Проверяем, существует ли страница в HTML
    const targetPage = document.getElementById('page-' + name)
    if (targetPage) {
        targetPage.classList.add('active-page')
    } else {
        console.error(`Ошибка: Страница с id="page-${name}" не найдена в HTML!`)
    }
    // показываем нужную
    document.getElementById('page-' + name).classList.add('active-page')
    // убираем active со всех кнопок меню
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
    // ставим active на нажатую кнопку
    if (btn) btn.classList.add('active')
    //добавили текущую страницу
    localStorage.setItem('currentPage', name)
    // загружаем данные для нужной страницы
    // прячем плеер на странице настроек
    const rightColumn = document.querySelector('.right-column')
    const bottomPlayer = document.getElementById('bottom-player-bar')
    // УПРАВЛЕНИЕ НИЖНИМ ПЛЕЕРОМ 
    // Показываем нижний плеер ТОЛЬКО на странице favorites, на остальных — скрываем
    if (bottomPlayer) {
        if (name === 'favorites') {
            bottomPlayer.style.display = 'flex'
        } else {
            bottomPlayer.style.display = 'none'
        }
    }
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
    if (name === 'artists') {
    loadArtists()
    }
    // плеер прячем как в настройках
    if (name === 'artists' || name === 'artist' || name === 'settings' || name === 'favorites' || name === 'wave') {
        rightColumn.style.display = 'none'
    } else {
        rightColumn.style.display = 'flex'
    }
    if (name === 'favorites') {
    loadFavorites()
    }
    if (name === 'settings') {
        loadProfile()
    }
    if (name === 'search') {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/tracks/search', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => res.json())
        .then(tracks => { tracksList = tracks })
    }
    if (name === 'home') {
    loadHomePage()
    }
    if (name === 'wave') {
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
    let  menu = document.getElementById('playlist-menu-' + trackId)
    // Если меню еще нет на этой странице (например, в поиске), 
    // робот сам создаст его и прикрепит прямо к кнопке плюсика
     if (!menu) {
        menu = document.createElement('div')
        menu.id = 'playlist-menu-' + trackId
        menu.className = 'playlist-menu'
        menu.style.display = 'none'
        // Вставляем меню в HTML сразу после кнопки, на которую нажали
        btn.after(menu)
    }
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
                             ${playlist.name}
                        </div>
                    `
                })
            }
            menu.style.display = 'block'
        }).catch(err => console.error('Ошибка загрузки меню плейлистов:', err))
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
                alert(data.error) 
            } else {
                alert(`Добавлено в "${playlistName}"!`)
            }
            document.getElementById('playlist-menu-' + trackId).style.display = 'none'
        }).catch(err => console.error("Ошибка добавления:", err))
}
// Функция открытия плейлиста прямо внутри его карточки
function openPlaylist(id, name) {
    // Ищем карточку плейлиста, на которую кликнули (в твоем коде они рендерятся в #playlists-list)
    // Чтобы это сработало, убедись, что при рендере списка плейлистов ты задаешь им id, например: id="playlist-card-${playlist.id}"
    const playlistCard = document.getElementById('playlist-card-' + id) || event.currentTarget;
    // Ищем, открыт ли уже список треков внутри этой карточки
    let container = playlistCard.querySelector('.open-playlist-tracks');
    if (container) {
        // Если уже открыт — просто закрываем (сворачиваем папку)
        container.remove();
        playlistCard.classList.remove('is-open');
        return;
    }
    fetch(`http://localhost:3000/playlists/${id}/tracks`)
        .then(res => res.json())
        .then(tracks => {
            container = document.createElement('div');
            container.className = 'open-playlist-tracks';
            if (tracks.length === 0) {
                container.innerHTML = '<p class="empty-playlist-text">Плейлист пока пустой</p>';
            } else {
                tracks.forEach(track => {
                    container.innerHTML += `
                        <div class="playlist-track-row" data-track-id="${track.id}" data-playlist-track="${track.id}">
                            <div class="track-info-block">
                                <span class="track-title">${track.title}</span>
                                <span class="track-artist">${track.artist}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
    <button class="play-icon-btn" data-track-id="${track.id}" onclick="event.stopPropagation(); playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶</button>
    <button class="remove-track-from-playlist-btn" onclick="event.stopPropagation(); removeFromPlaylist(${track.id}, ${id})">🗑️</button>
                    `;
                });
            }
            // Добавляем список треков прямо внутрь карточки плейлиста
            playlistCard.appendChild(container);
            playlistCard.classList.add('is-open');
        });
}
function setTheme(name) {
    document.querySelectorAll('.theme-dot').forEach(c => c.classList.remove('active'))
    event.target.closest('.theme-dot').classList.add('active')
    localStorage.setItem('theme', name)
    applyTheme(name)
}
function applyTheme(name) {
    const root = document.documentElement

    // Сохраняем выбор пользователя в память браузера
    localStorage.setItem('selected-theme', name)

    if (name === 'pink') {
        root.style.setProperty('--bg', '#fdf0f5')
        root.style.setProperty('--accent', '#e07090')
        root.style.setProperty('--accent-hover', '#c2678a')
        root.style.setProperty('--border', '#f4c2d8')
        // Розовое полупрозрачное стекло
        root.style.setProperty('--sidebar-bg', 'rgba(255, 240, 245, 0.4)') 
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
        // Сиреневое полупрозрачное стекло
        root.style.setProperty('--sidebar-bg', 'rgba(237, 230, 255, 0.45)') 
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
        // Голубое полупрозрачное стекло
        root.style.setProperty('--sidebar-bg', 'rgba(230, 244, 255, 0.45)') 
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
        // Тёмно-серый стеклянный сайдбар для темной темы
        root.style.setProperty('--sidebar-bg', 'rgba(22, 33, 62, 0.5)') 
        root.style.setProperty('--card-bg', '#0f3460')
        root.style.setProperty('--card-inner', '#16213e')
        root.style.setProperty('--text', '#ffffff')
        root.style.setProperty('--text-secondary', '#aaaacc')
        root.style.setProperty('--heading', '#7e9bf8')
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme') || 'pink' // Если ничего не сохранено, будет по дефолту розовая
    applyTheme(savedTheme)
})
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

function loadProfile() {
    const login = localStorage.getItem('login')
    const name = localStorage.getItem('name')
    const loginEl = document.getElementById('user-login-val')
    const nameEl = document.getElementById('user-name-val')
    if (loginEl) loginEl.textContent = login || ''
    if (nameEl) nameEl.textContent = name || ''
    // загружаем дизлайкнутые треки
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/tracks/disliked', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => res.json())
        .then(tracks => {
            const list = document.getElementById('blacklist-tracks-container')
            if (!list) return
            if (tracks.length === 0) {
                list.innerHTML = '<p style="color:var(--text-secondary); font-size:0.85rem">Пока ничего нет</p>'
                return
            }
            list.innerHTML = ''
            tracks.forEach(track => {
                list.innerHTML += `
                <div class="blacklist-item-row">
                    <div class="track-title-info">
                        <span class="b-title">${track.title}</span>
                        <span class="b-artist">${track.artist}</span>
                    </div>
                    <button onclick="removeDislike(${track.id}, this)"
                            style="background:none; border:none; font-size:1.2rem;
                                   cursor:pointer; color:var(--text-secondary)">×</button>
                </div>`
            })
        })
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
        ['#fffd9d', '#e9a246'],
        ['#c77dff', '#d218f3'],
        ['#4fc3f7', '#3462eb'],
        ['#ff6eb4', '#ff9de2'],
        ['#a78bfa', '#60a5fa'],
        ['#60d4c1', '#2ccc6a']
    ]

    for (let i = 0; i < 7; i++) {
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
        ctx.filter = 'blur(3px)'
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
        //Обновляем ГЛАВНЫЙ БОЛЬШОЙ плеер
        document.getElementById('progress-fill').style.width = percent + '%'
        document.getElementById('progress-dot').style.left = percent + '%'
        document.getElementById('current-time').textContent = formatTime(current)
        document.getElementById('total-time').textContent = formatTime(total)
        //Обновляем НИЖНИЙ ФИКСИРОВАННЫЙ плеер 
        const bpProgress = document.getElementById('bp-progress-bar')
        const bpCurrent = document.getElementById('bp-current-time')
        const bpTotal = document.getElementById('bp-total-time')
        if (bpProgress) bpProgress.value = percent
        if (bpCurrent) bpCurrent.textContent = formatTime(current)
        if (bpTotal) bpTotal.textContent = formatTime(total)
    })
    audio.addEventListener('play', () => {
        document.getElementById('play-btn').textContent = '⏸'
        // Синхронизируем кнопку на нижнем плеере
        const bpPlayBtn = document.getElementById('bp-play-btn')
        if (bpPlayBtn) bpPlayBtn.textContent = '||'
    })
    audio.addEventListener('pause', () => {
        document.getElementById('play-btn').textContent = '▶'
        // Синхронизируем кнопку на нижнем плеере
        const bpPlayBtn = document.getElementById('bp-play-btn')
        if (bpPlayBtn) bpPlayBtn.textContent = '▶'
    })
    //добавили для повтора трека в плеере
    audio.addEventListener('ended', () => {
        if (repeatOnce) {
            audio.currentTime = 0
            audio.play()
            repeatOnce = false
            document.getElementById('repeat-btn').style.color = ''
        } else {
            nextTrack()
        }
    })
})


function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return m + ':' + (s < 10 ? '0' + s : s)
}
function togglePlay() {
    const player = document.getElementById('audio-player')
    const bpPlayBtn = document.getElementById('bp-play-btn')
    const mainPlayBtn = document.getElementById('play-btn')

    if (!player.src || player.src === window.location.href) return

    if (player.paused) {
        player.play()
    } else {
        player.pause()
    }
}
function seekAudio(event) {
    const audio = document.getElementById('audio-player')
    const bar = event.currentTarget
    const rect = bar.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    audio.currentTime = percent * audio.duration
}
//Мы объявили вверху уже
// // список треков для переключения
// let tracksList = []
// let currentTrackIndex = 0


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
//Для звездочек в плеере(rating)
let currentRating = 0
function toggleStars() {
    const popup = document.getElementById('stars-popup')
    if (popup.style.display === 'flex') {
        popup.style.display = 'none'
    } else {
        popup.style.display = 'flex'
        if (currentTrackId) loadRating(currentTrackId)
    }
}
function loadRating(trackId) {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/tracks/${trackId}/rate`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => res.json())
        .then(data => {
            currentRating = data.userRating ?? data.rating ?? 0  //оценка
            updateStars(currentRating)  //красим в жёлтый сразу
            const avg = document.getElementById('avg-rating')
            if (data.avg > 0) {
                avg.textContent = `Средняя оценка: ${data.avg} ⭐`
            } else {
                avg.textContent = ''
            }
        })
}
function updateStars(rating) {
    const stars = document.querySelectorAll('.star')
    stars.forEach((star, i) => {
        if (i < rating) {
            star.textContent = '★'
            star.classList.add('active')
        } else {
            star.textContent = '☆'
            star.classList.remove('active')
        }
    })
}
function rateTrack(rating) {
    if (!currentTrackId) {
        alert('Сначала выбери трек')
        return
    }
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/tracks/${currentTrackId}/rate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ rating })
    })
        .then(res => res.json())
        .then(data => {
            currentRating = rating
            updateStars(rating)
            document.getElementById('star-btn').classList.add('rated')
            const avg = document.getElementById('avg-rating')
            avg.textContent = `Средняя оценка: ${data.avg} ⭐`
        })
}
//for repeat || in player
let repeatOnce = false
function toggleRepeat() {
    repeatOnce = !repeatOnce
    const btn = document.getElementById('repeat-btn')
    btn.style.color = repeatOnce ? 'var(--accent)' : ''  // розовая если включён
}
// Функция для загрузки списка треков с сервера в память фронтенда
function loadTracksForSearch() {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('http://localhost:3000/search', { 
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        tracksList = data // Сохраняем полученные треки в массив, который фильтрует поиск
    })
    .catch(err => console.error('Ошибка загрузки треков для поиска:', err))
}
//функция поиска линейного и рисовка
function searchTracks() {
    const query = document.getElementById('search-input').value.toLowerCase().trim()
    const list = document.getElementById('search-results')
    list.innerHTML = ''
    if (query === '') {
        return
    }
    const filtered = tracksList.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    )
    if (filtered.length === 0) {
        list.innerHTML = '<p>Ничего не найдено</p>'
        return
    }
    filtered.forEach(track => {
    const icon = track.inLibrary ? '✓' : '✕'
    const iconColor = track.inLibrary ? '#729773' : '#ccc'
    list.innerHTML += `
    <div class="search-result-row">
        <div class="search-result-info">
            <span class="s-title">${track.title}</span>
            <span class="s-artist">${track.artist}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
            <button class="play-icon-btn" data-track-id="${track.id}" onclick="event.stopPropagation(); playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶</button>
        </div>
    </div>
`
})
}
//Новые функции для главной страницы
function loadHomePage() {
    // топ 5
    fetch('http://localhost:3000/tracks/top')
        .then(res => res.json())
        .then(tracks => {
            const list = document.getElementById('top-tracks')
            list.innerHTML = ''
            tracks.forEach((track, i) => {
    const stars = '★'.repeat(Math.round(track.avg_rating || 0)) +
                  '☆'.repeat(5 - Math.round(track.avg_rating || 0))
    list.innerHTML += `
    <div class="search-track-card">
        <span style="font-weight:700; color:var(--accent); min-width:25px">${i + 1}</span>
        <div class="search-track-info">
            <span class="track-title">${track.title}</span>
            <span class="track-artist">${track.artist}</span>
        </div>
        <div class="search-track-actions">
            <span style="color:#ffd700; font-size:0.85rem">${stars}</span>
            <button class="search-play-btn" data-track-id="${track.id}" onclick="playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶</button>
        </div>
    </div>`
    }) 
})
    // последние 5
    fetch('http://localhost:3000/tracks/recent')
        .then(res => res.json())
        .then(tracks => {
            const list = document.getElementById('recent-tracks')
            list.innerHTML = ''
            tracks.forEach(track => {
                list.innerHTML += `
                <div class="search-track-card">
                    <div class="search-track-info">
                        <span class="track-title">${track.title}</span>
                        <span class="track-artist">${track.artist}</span>
                    </div>
                    <div class="search-track-actions">
                        <button class="search-play-btn" data-track-id="${track.id}" onclick="playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶</button>
                    </div>
                </div>`
            })
        })
}
// НОВЫЕ ФУНКЦИИ ДЛЯ СТРАНИЦЫ С АРТИСТАМИ
function addArtist() {
    const name = document.getElementById('artist-name').value
    const photo = document.getElementById('artist-photo').files[0]
    if (!name) {
        alert('Введи имя артиста')
        return
    }
    const formData = new FormData()
    formData.append('name', name)
    if (photo) formData.append('photo', photo)
    fetch('http://localhost:3000/artists', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            document.getElementById('artist-name').value = ''
            document.getElementById('artist-photo').value = ''
            loadArtists()
        })
}
function loadArtists() {
    fetch('http://localhost:3000/artists')
        .then(res => res.json())
        .then(artists => {
            const grid = document.getElementById('artists-grid')
            grid.innerHTML = ''
            if (artists.length === 0) {
                grid.innerHTML = '<p>Артистов пока нет</p>'
                return
            }
            grid.className = 'artists-grid'
            artists.forEach(artist => {
                const photo = artist.photo
                    ? `<img src="http://localhost:3000/uploads/covers/${artist.photo}" alt="${artist.name}">`
                    : `<div class="artist-no-photo">🎤</div>`
                grid.innerHTML += `
                <div class="artist-card" onclick="openArtist(${artist.id}, '${artist.name}')">
                    ${photo}
                    <span>${artist.name}</span>
                </div>`
            })
        })
}
function openArtist(id, name) {
    fetch(`http://localhost:3000/artists/${id}/tracks`)
        .then(res => res.json())
        .then(data => {
            showPage('artist')
            // шапка артиста
            const header = document.getElementById('artist-header')
            const photo = data.artist.photo
                ? `<img src="http://localhost:3000/uploads/covers/${data.artist.photo}" alt="${data.artist.name}">`
                : `<div style="font-size:3rem">🎤</div>`
            header.innerHTML = `
            <div class="artist-page-header">
                ${photo}
                <h2>${data.artist.name}</h2>
            </div>`
            // треки артиста
            const list = document.getElementById('artist-tracks')
            list.innerHTML = ''
            if (data.tracks.length === 0) {
                list.innerHTML = '<p>Треков пока нет</p>'
                return
            }
            data.tracks.forEach(track => {
                list.innerHTML += `
                <div class="search-track-card">
                    <div class="search-track-info">
                        <span class="track-title">${track.title}</span>
                        <span class="track-artist">${track.artist}</span>
                    </div>
                   <div class="search-track-actions">
    <button class="search-play-btn" data-track-id="${track.id}" onclick="playTrack('${track.filename}', '${track.title}', '${track.artist}', ${track.id}, '${track.cover}')">▶</button>
</div>
                </div>`
            })
        })
}
function dislikeTrack() {
    if (!currentTrackId) return
    const token = localStorage.getItem('token')
    const likeBtn = document.querySelector('.like-btn')
    const dislikeBtn = document.querySelector('.dislike-btn')
    const isDislikedNow = dislikeBtn.classList.contains('disliked')

    const url = isDislikedNow
        ? `http://localhost:3000/tracks/undislike/${currentTrackId}`
        : `http://localhost:3000/tracks/dislike/${currentTrackId}`

    fetch(url, {
        method: isDislikedNow ? 'DELETE' : 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => res.json())
        .then(() => {
            dislikeBtn.classList.toggle('disliked')
            // если поставили дизлайк — гасим лайк
            if (!isDislikedNow) {
                likeBtn.classList.remove('liked')
                const track = tracksList.find(t => t.id === currentTrackId)
                if (track) { track.is_liked = false; track.is_disliked = true }
            } else {
                const track = tracksList.find(t => t.id === currentTrackId)
                if (track) track.is_disliked = false
            }
        })
}
function removeDislike(trackId, btn) {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/tracks/undislike/${trackId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }})
        .then(res => res.json())
        .then(() => {
            // убираем карточку из списка
            btn.closest('.blacklist-item-row').remove()
        })
}
function loadBlacklist() {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/blacklist', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(tracks => {
        const container = document.getElementById('blacklist-tracks-container')
        container.innerHTML = ''
        if (tracks.length === 0) {
            container.innerHTML = '<p class="empty-playlist-text">Список пуст</p>'
            return
        }
        tracks.forEach(track => {
            container.innerHTML += `
                <div class="blacklist-item-row" id="blacklist-row-${track.id}">
                    <div class="track-title-info">
                        <span class="b-title">${track.title}</span>
                        <span class="b-artist">${track.artist}</span>
                    </div>
                    <!-- При клике шлём запрос на бэкенд -->
                    <button class="remove-from-blacklist-btn" onclick="removeFromBlacklist(${track.id})">❌</button>
                </div>
            `
        })
    })
}
function removeFromBlacklist(trackId) {
    const token = localStorage.getItem('token')
    // Делаем запрос к роуту 
    fetch(`http://localhost:3000/tracks/undislike/${trackId}`, {
        method: 'DELETE', // или 'POST'
        headers: {'Authorization': 'Bearer ' + token}
    })
    .then(res => res.json())
    .then(data => {
        // Если сервер подтвердил удаление из БД
        if (data.success || !data.error) {
            const row = document.getElementById(`blacklist-row-${trackId}`)
            if (row) row.remove()
            //выводим уведомление
            console.log('Трек успешно вернулся в общий доступ')
            // Если список опустел, пишем, что он пуст
            const container = document.getElementById('blacklist-tracks-container')
            if (container && container.children.length === 0) {
                container.innerHTML = '<p class="empty-playlist-text">Список пуст</p>'
            }
            // Обновляем статус трека в памяти, если он сейчас загружен на главной
            const track = tracksList.find(t => t.id === trackId)
            if (track) track.is_disliked = false
            } else {
                alert('Ошибка сервера: ' + data.error)
            }
    })
    .catch(err => console.error('Ошибка:', err))
}
// Функция загрузки списка Любимого с бэкенда
function loadFavorites() {
    const token = localStorage.getItem('token')
    // Запрашиваем треки из роута лайков (создай или используй существующий /tracks/liked)
    fetch('http://localhost:3000/tracks/liked', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(tracks => {
        renderFavorites(tracks)
    })
    .catch(err => console.error('Ошибка загрузки любимых треков:', err))
}
function renderFavorites(tracks) {
    const container = document.getElementById('favorites-tracks-list')
    if (!container) return
    container.innerHTML = ''
    if (tracks.length === 0) {
        container.innerHTML = '<p style="opacity:0.6;">Тут пока пусто. Ставь лайки трекам</p>'
        return
    }
    const audio = document.getElementById('audio-player')
    tracks.forEach(track => {
        const isCurrentPlaying = (currentTrackId === track.id && !audio.paused)
        const playIcon = isCurrentPlaying ? '⏸' : '▶'
        container.innerHTML += `
        <div class="fav-track-row" id="fav-row-${track.id}">
            <div class="fav-meta">
                <span class="fav-title">${track.title}</span>
                <span class="fav-artist">${track.artist}</span>
            </div>
            <div class="fav-actions">
                <button class="fav-play-btn" data-track-id="${track.id}" onclick="handleFavPlay(${track.id}, '${track.filename}', '${track.title}', '${track.artist}', '${track.cover}')">${playIcon}</button>
                <button class="fav-heart-btn" onclick="removeLikeFromFavorites(${track.id})">❤️</button>
            </div>
        </div>`
    })
}

// Удаление лайка прямо со страницы Любимое
function removeLikeFromFavorites(trackId) {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/tracks/unlike/${trackId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        // Удаляем строку из анимации интерфейса
        const row = document.getElementById(`fav-row-${trackId}`)
        if (row) row.remove()
        // Синхронизируем статус в локальном массиве памяти
        const track = tracksList.find(t => t.id === trackId)
        if (track) track.is_liked = false
        // Если удалили трек, который сейчас играет в нижнем плеере — обновляем иконку лайка там
        if (currentTrackId === trackId) {
            const bpLike = document.querySelector('.bp-like-btn')
            if (bpLike) bpLike.textContent = '🤍'
        }
    })
}
// Обработка клика по кнопке Play в списке Любимого
function handleFavPlay(id, filename, title, artist,cover) {
    if (currentTrackId === id) {
        togglePlay()
        
     } else {

        playTrack(filename, title, artist, id, cover)

        // Вместо ручного обновления — вызовем updatePlayButtons

        updatePlayButtons()

    }
}
// Функция, которая заменяет старое название и артиста на новые при переключении треков
function updateBottomPlayer(title, artist, isLiked) {
    const bpTitle = document.getElementById('bp-title')
    const bpArtist = document.getElementById('bp-artist')
    const bpPlayBtn = document.getElementById('bp-play-btn')
    const bpLike = document.querySelector('.bp-heart-btn')
    // Робот берет новые данные из посылки (title, artist) и вставляет их в HTML
    if (bpTitle) bpTitle.textContent = title
    if (bpArtist) bpArtist.textContent = artist
    if (bpPlayBtn) bpPlayBtn.textContent = '⏸' // Ставим иконку паузы, так как трек пошел
    // Обновляем состояние нижнего сердечка (красное или белое)
    if (bpLike) {
        bpLike.textContent = isLiked ? '❤️' : '🤍'
    }
}
function seekTrack(value) {
    const audio = document.getElementById('audio-player')
    if (!audio.duration) return
    // Переводим проценты (0-100) в реальные секунды трека
    audio.currentTime = (value / 100) * audio.duration
}
//Эта функция нужна, чтобы когда ты слушаешь трек на странице «Любимое», ты мог нажать на сердечко в 
// нижнем плеере, и лайк сразу снимался и на бэкенде, и карточка исчезала с экрана:
function toggleLikeCurrent() {
    if (!currentTrackId) return
    const token = localStorage.getItem('token')
    // Так как на этой странице все треки изначально лайкнутые, 
    // нажатие на нижнее сердечко всегда будет отправлять DELETE запрос на снятие лайка
    fetch(`http://localhost:3000/tracks/unlike/${currentTrackId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Гасим сердечко в нижнем плеере (делаем белым)
            const bpLike = document.querySelector('.bp-heart-btn')
            if (bpLike) bpLike.textContent = '🤍'
            // Синхронизируем статус в памяти фронтенда
            const track = tracksList.find(t => t.id === currentTrackId)
            if (track) track.is_liked = false
            // Сразу же удаляем карточку этого трека со страницы «Любимое», если она там отрисована
            const row = document.getElementById(`fav-row-${currentTrackId}`)
            if (row) row.remove()
            
            // Если это был последний трек в списке, выведем надпись, что пусто
            const container = document.getElementById('favorites-tracks-list')
            if (container && container.children.length === 0) {
                container.innerHTML = '<p style="opacity:0.6;">Тут пока пусто. Ставь лайки трекам</p>'
            }
        }
    })
    .catch(err => console.error('Ошибка при снятии лайка из нижнего плеера:', err))
}
function toggleUploadForm() {
    // Находим нашу секцию загрузки
    const uploadSection = document.querySelector('.upload-section');
    
    // Переключаем класс 'open' (если его нет — добавит, если есть — уберет)
    uploadSection.classList.toggle('open');
}

function syncAllPlayButtons(isPlaying) {
    const icon = isPlaying ? '⏸' : '▶'
    const allPlayBtns = document.querySelectorAll('.fav-play-btn, .play-icon-btn, .search-play-btn')

    allPlayBtns.forEach(btn => {
        // У каждой кнопки в data-id может лежать id трека
        const btnTrackId = btn.dataset.trackId ? parseInt(btn.dataset.trackId) : null
        if (btnTrackId === currentTrackId) {
            btn.textContent = icon
        } else {
            btn.textContent = '▶'
        }
    })

    // Нижний плеер — тоже
    const bpPlayBtn = document.getElementById('bp-play-btn')
    if (bpPlayBtn) bpPlayBtn.textContent = icon
     const mainPlayBtn = document.getElementById('play-btn')

    if (mainPlayBtn) mainPlayBtn.textContent = icon

}
// Удаление трека из плейлиста
function removeFromPlaylist(trackId, playlistId) {
    fetch(`http://localhost:3000/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        // Удаляем строку трека из открытого плейлиста
        const row = document.querySelector(`[data-playlist-track="${trackId}"]`)
        if (row) row.remove()
        // Если плейлист стал пустым — показываем надпись
        const container = document.querySelector('.open-playlist-tracks')
        if (container && container.querySelectorAll('.playlist-track-row').length === 0) {
            container.innerHTML = '<p class="empty-playlist-text">Плейлист пока пустой</p>'
        }
    })
    .catch(err => console.error('Ошибка удаления из плейлиста:', err))
}
// Удаление трека из базы данных
function deleteTrack(trackId) {
    if (!confirm('Удалить трек навсегда?')) return
    
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/tracks/${trackId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        // СПОСОБ 1: Удаляем через data-track-id
        const row = document.querySelector(`[data-track-id="${trackId}"]`)
        if (row) {
            row.remove()
            console.log('Трек удалён')
        }
        
        // СПОСОБ 2: Если не нашли через data-track-id, ищем через кнопку
        if (!row) {
            const btn = document.querySelector(`button[onclick*="deleteTrack(${trackId})"]`)
            if (btn) {
                const card = btn.closest('.playlist-track-row')
                if (card) card.remove()
            }
        }
        
        // Если удалили играющий трек
        if (currentTrackId === trackId) {
            const player = document.getElementById('audio-player')
            if (player) {
                player.pause()
                player.src = ''
            }
            currentTrackId = null
            syncAllPlayButtons(false)
        }
        
        // Обновляем главную страницу (если нужно)
        // loadHomePage()
    })
    .catch(err => console.error('Ошибка удаления трека:', err))
}

// Моя Волна - переменные
let waveTracks = []
let waveIndex = 0
let waveAudio = null

// Загрузка волны
async function loadWave() {
    const token = localStorage.getItem('token')
    try {
        const res = await fetch('http://localhost:3000/tracks/wave', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        waveTracks = await res.json()
        waveIndex = 0
        
        if (waveTracks.length === 0) {
            alert('Нет треков для волны. Загрузите хотя бы несколько треков')
            return
        }
        
        // Загружаем первый трек
        loadWaveTrack(waveIndex)
    } catch (err) {
        console.error('Ошибка загрузки волны:', err)
        alert('Ошибка загрузки волны')
    }
}

// Загрузка трека из волны
// Загрузка трека из волны
function loadWaveTrack(index) {
    if (index < 0 || index >= waveTracks.length) return
    
    waveIndex = index
    const track = waveTracks[waveIndex]
    
    // Обновляем UI
    document.getElementById('wave-title').textContent = track.title
    document.getElementById('wave-artist').textContent = track.artist
    
    const cover = document.getElementById('wave-cover')
    // ДОБАВИЛИ ПРОВЕРКУ: если элемент cover существует на странице, то обновляем его
    if (cover) {
        if (track.cover && track.cover !== 'null') {
            cover.src = `http://localhost:3000/uploads/covers/${track.cover}`
        } else {
            cover.src = 'images/penguin-logo.png'
        }
    }
    
    // Создаём отдельный audio элемент для волны
    if (!waveAudio) {
        waveAudio = new Audio()
        waveAudio.addEventListener('timeupdate', updateWaveProgress)
        waveAudio.addEventListener('ended', waveNext)
    }
    
    waveAudio.src = `http://localhost:3000/uploads/${track.filename}`
    // не автозапускаем — пользователь сам нажмёт play
    waveAudio.play()
    .then(() => {
        waveIsPlaying = true
        document.getElementById('wave-play-btn').textContent = '⏸'
    })
    .catch(err => {
        // браузер заблокировал автовоспроизведение
        waveIsPlaying = false
        document.getElementById('wave-play-btn').textContent = '▶'
        console.log('Автовоспроизведение заблокировано:', err)
    })
    updateCarousel() 
}

// Play/Pause для волны
let waveIsPlaying = false
function waveTogglePlay() {
    if (waveTracks.length === 0) {
        // первый раз — загружаем треки и сразу играем
        loadWave()
        return
    }
    
    const btn = document.getElementById('wave-play-btn')
    if (waveIsPlaying) {
        waveAudio.pause()
        waveIsPlaying = false
        btn.textContent = '▶'
    } else {
        waveAudio.play()
        waveIsPlaying = true
        btn.textContent = '⏸'
    }
}
// Следующий трек
function waveNext() {
    if (waveTracks.length === 0) return
    waveIndex = (waveIndex + 1) % waveTracks.length
    loadWaveTrack(waveIndex)
}

// Предыдущий трек
function wavePrev() {
    if (waveTracks.length === 0) return
    waveIndex = (waveIndex - 1 + waveTracks.length) % waveTracks.length
    loadWaveTrack(waveIndex)
}

// Обновление прогресса
function updateWaveProgress() {
    if (!waveAudio) return
    
    const current = waveAudio.currentTime
    const total = waveAudio.duration || 0
    const percent = total ? (current / total) * 100 : 0
    
    document.getElementById('wave-progress').value = percent
    document.getElementById('wave-current-time').textContent = formatTime(current)
    document.getElementById('wave-total-time').textContent = formatTime(total)
}

// Перемотка
function waveSeek(value) {
    if (!waveAudio || !waveAudio.duration) return
    waveAudio.currentTime = (value / 100) * waveAudio.duration
}

// Лайк текущего трека волны
function waveLike() {
    if (!waveTracks[waveIndex]) return
    const trackId = waveTracks[waveIndex].id
    const token = localStorage.getItem('token')
    
    fetch(`http://localhost:3000/tracks/like/${trackId}`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(() => {
        alert('Добавлено в любимые ❤️')
    })
}

// Дизлайк текущего трека волны
function waveDislike() {
    if (!waveTracks[waveIndex]) return
    const trackId = waveTracks[waveIndex].id
    const token = localStorage.getItem('token')
    
    fetch(`http://localhost:3000/tracks/dislike/${trackId}`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(() => {
        alert('Трек добавлен в чёрный список')
        waveNext() // Переходим к следующему треку
    })
}

// При переходе на страницу волны - загружаем треки
const originalShowPage = showPage
showPage = function(name, btn) {
    originalShowPage(name, btn)
    if (name === 'wave') {
        loadWave()
    }
}
function waveSetVolume(value) {
    if (waveAudio) waveAudio.volume = value / 100
}

// Колесико мыши для громкости
document.addEventListener('wheel', (e) => {
    const wavePage = document.getElementById('page-wave')
    if (!wavePage || !wavePage.classList.contains('active-page')) return
    if (!waveAudio) return
    
    e.preventDefault()
    let vol = waveAudio.volume
    vol += e.deltaY < 0 ? 0.05 : -0.05
    vol = Math.max(0, Math.min(1, vol))
    waveAudio.volume = vol
    document.getElementById('wave-volume').value = vol * 100
}, { passive: false })

function updateCarousel() {
    const carousel = document.getElementById('carousel-track')
    if (!carousel || waveTracks.length === 0) return
    
    carousel.innerHTML = ''
    const indexes = [
        (waveIndex - 1 + waveTracks.length) % waveTracks.length,
        waveIndex,
        (waveIndex + 1) % waveTracks.length
    ]
    
    indexes.forEach((i, pos) => {
        const track = waveTracks[i]
        const div = document.createElement('div')
        div.className = 'carousel-card' + (pos === 1 ? ' active' : '')
        div.innerHTML = `
            <img src="${track.cover && track.cover !== 'null' 
                ? 'http://localhost:3000/uploads/covers/' + track.cover 
                : 'images/penguin-logo.png'}" class="cover-art">
            <div class="track-title">${track.title}</div>
        `
        carousel.appendChild(div)
    })
}