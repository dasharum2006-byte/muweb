 Music Website
Музыкальный веб‑сервис: можно регистрироваться, загружать треки, слушать их во встроенном плеере, ставить лайки/дизлайки, оценивать звёздочками, собирать плейлисты и слушать персональную ленту «Моя Волна».
Проект  — фронтенд на JavaScript, бэкенд на Node.js + Express, база данных SQLite.
Возможности
Регистрация и вход — пароли хранятся в зашифрованном виде (bcrypt), авторизация через JWT‑токены.
Восстановление пароля по секретному слову.
Загрузка треков с обложкой.
Два плеера:
большой кастомный плеер с прогрессом, громкостью и сменой вида обложки;
нижний мини‑плеер (адаптивная капсула на телефоне).
🌊 Моя Волна — отдельная лента рекомендаций со своим плеером.
❤️ Лайки / дизлайки и страница «Любимое».
⭐️ Оценки треков (рейтинг от 1 до 5).
📂 Плейлисты — создание и добавление треков.
🎤 Артисты — список исполнителей с фото и их треками.
🔎 Поиск по трекам.
 Адаптивная вёрстка (десктоп / планшет / телефон).
 Технологии
Frontend
HTML, CSS, Vanilla JavaScript (без фреймворков)
Fetch API для запросов к бэкенду
Backend
Node.js (https://nodejs.org/) + Express 5 (https://expressjs.com/)
better-sqlite3 (https://github.com/WiseLibs/better-sqlite3) — база данных
bcrypt (https://www.npmjs.com/package/bcrypt) — хеширование паролей
jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken) — JWT‑авторизация
multer (https://www.npmjs.com/package/multer) — загрузка файлов
cors (https://www.npmjs.com/package/cors), dotenv (https://www.npmjs.com/package/dotenv)
Структура проекта
music-website/
├── mubackend/                 # Серверная часть
│   ├── db/
│   │   └── database.js        # Подключение к SQLite и создание таблиц
│   ├── routes/
│   │   ├── auth.js            # Регистрация, вход, смена/восстановление пароля
│   │   ├── tracks.js          # Треки, лайки, оценки, поиск, "Моя Волна"
│   │   ├── playlists.js       # Плейлисты
│   │   └── artists.js         # Артисты
│   ├── uploads/               # Загруженные аудио и обложки (создаётся сам)
│   ├── server.js              # Точка входа сервера
│   └── .env                   # Секреты (НЕ коммитится)
│
└── mufrontend/                # Клиентская часть
    ├── index.html             # Основное приложение
    ├── login.html             # Страница входа/регистрации
    ├── app.js                 # Вся логика интерфейса и плееров
    ├── style.css              # Стили приложения
    ├── auth.js / auth.css     # Логика и стили авторизации
    └── images/                # Иконки и логотип
Запуск проекта
Требования
Node.js (https://nodejs.org/) 
1. Клонировать репозиторий
git clone <URL-репозитория>
cd music-website/mubackend
2. Установить зависимости
npm install
3. Создать файл .env
В папке mubackend/ создай файл .env:
SECRET=любая_длинная_секретная_строка
SECRET используется для подписи JWT‑токенов.
4. Создать папку для загрузок
mkdir uploads
5. Запустить сервер
node server.js
Сервер поднимется на http://localhost:3000 и сам отдаёт фронтенд. База данных db/music.db и таблицы создаются автоматически при первом запуске.
6. Открыть в браузере
http://localhost:3000
API (основные маршруты)
Базовый адрес: http://localhost:3000
Авторизация — /auth
Метод	Путь	Описание
POST	/auth/register	Регистрация (login, name, password, секретное слово)
POST	/auth/login	Вход, возвращает JWT‑токен
POST	/auth/recover-password	Восстановление пароля по секретному слову
POST	/auth/change-password	Смена пароля
Треки — /tracks
Метод	Путь	Описание
GET	/tracks	Список всех треков
POST	/tracks/upload	Загрузить трек (audio + обложка)
GET	/tracks/search?q=	Поиск треков
GET	/tracks/top	Топ треков
GET	/tracks/recent	Недавние треки
GET	/tracks/wave	Лента «Моя Волна»
POST	/tracks/like/:id	Лайк трека
DELETE	/tracks/unlike/:id	Убрать лайк
GET	/tracks/liked	Любимые треки
POST	/tracks/dislike/:id	Дизлайк
DELETE	/tracks/undislike/:id	Убрать дизлайк
POST	/tracks/:id/rate	Поставить оценку
GET	/tracks/:id/rate	Получить свою оценку
DELETE	/tracks/:id	Удалить трек
Плейлисты — /playlists
Метод	Путь	Описание
GET	/playlists	Список плейлистов
POST	/playlists	Создать плейлист
GET	/playlists/:id/tracks	Треки плейлиста
POST	/playlists/:id/tracks	Добавить трек в плейлист
DELETE	/playlists/:id/tracks/:trackId	Убрать трек из плейлиста
Артисты — /artists
Метод	Путь	Описание
GET	/artists	Список артистов
POST	/artists	Добавить артиста (с фото)
GET	/artists/:id/tracks	Треки артиста
Защищённые маршруты ожидают заголовок Authorization: Bearer <токен>.
 База данных
SQLite, основные таблицы: users, tracks, playlists, playlist_tracks, ratings, user_library, artists, track_likes, disliked_tracks. Создаются автоматически в mubackend/db/database.js.
Заметки
node_modules/, uploads/ и db/music.db не попадают в репозиторий (см. .gitignore).
Файл .env с секретом не коммить — добавь его в .gitignore, если ещё не добавлен.
Адрес бэкенда http://localhost:3000 сейчас прописан в коде фронтенда напрямую — при деплое его нужно будет заменить.
Статус
Проект в активной разработке 
