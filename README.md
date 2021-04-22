# Books App

### Запуск программы в dev режиме

```javascript
npm run dev
```

### Ссылка на heroku

[https://tfomina-books-app.herokuapp.com/](https://tfomina-books-app.herokuapp.com/)

### В докере

**Собрать**

```
docker build . -t books-app
```

**Запустить**

```
docker run --rm -p 3000:3000 books-app
```

**Запустить вместе с базой данных и со счетчиком просомтра книг через docker-compose**

```
docker-compose up --build
```
