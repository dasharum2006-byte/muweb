// когда страница загрузилась  - сразу загружаем треки
//document - all web page, .addEventListener - listen event - wait when something happend
// DOMContentLoaded - event - all page loaded(HTML,CSS)
document.addEventListener('DOMContentLoaded', () => {
    showPage('home') // показываем главную по умолчанию
})
// запоминаем какой трек сейчас играет
let currentTrackId = null
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
                        </div>
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
    //получаем доступ к элементам на странице
    //	Объяснение для робота
    //const player	Робот создает ящик с надписью "player" и кладет туда то, что найдет.
    //document.getElementById	Робот идет в HTML-код страницы и ищет элемент с ID равным audio-player.
    //'audio-player'	Это уникальное имя тега <audio> на странице
    currentTrackId = id //запоминаем id трека
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
        alert('Заполни все поля!')
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
            alert('Трек загружен!')
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

            playlists.forEach(playlist => {
                list.innerHTML += `
                    <div class="playlist-card">
                        <span>${playlist.name}</span>
                    </div>
                `
            })
        })
}

function createPlaylist() {
    const name = document.getElementById('playlist-name').value

    if (!name) {
        alert('Введи название плейлиста!')
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
    if (name === 'music') {
        loadTracks()
    }
    if (name === 'playlists') {
        loadPlaylists()
    }
}