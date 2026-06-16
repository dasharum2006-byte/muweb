// когда страница загрузилась  - сразу загружаем треки
//document - all web page, .addEventListener - listen event - wait when something happend
// DOMContentLoaded - event - all page loaded(HTML,CSS)
document.addEventListener('DOMContentLoaded', () => {
    loadTracks()
    loadPlaylists()
})
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
            const list = document.getElementById('tracks-list')
            list.innerHTML = ''

            if ()
        })
}