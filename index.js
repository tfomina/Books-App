const express = require("express");
const cors = require("cors");
const formData = require("express-form-data");

const { Book } = require("./models");

const store = {
  books: [],
};

for (let i = 1; i < 6; i++) {
  const newBook = new Book(
    `Title ${i}`,
    `Description ${i}`,
    `Author ${i}`,
    `Favorite ${i}`,
    `Filecover ${i}`,
    `Filename ${i}`
  );
  store.books.push(newBook);
}

const app = express();

app.use(formData.parse());
app.use(cors());

// авторизация пользователя
app.post("/api/user/login", (req, res) => {
  res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

// получить все книги
app.get("/api/books", (req, res) => {
  const { books } = store;
  res.json(books);
});

// получить книгу по id
app.get("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((b) => b.id === id);
  console.log("idx ", idx);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404).json("Not found");
  }
});

// создать книгу
app.post("/api/books", (req, res) => {
  const { books } = store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
  } = req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );

  books.push(newBook);

  res.status(201).json(newBook);
});

// редактировать книгу по id
app.put("/api/books/:id", (req, res) => {
  const { books } = store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
  } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((b) => b.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };
    res.json(books[idx]);
  } else {
    res.status(404).json("Not found");
  }
});

// удалить книгу по id
app.delete("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((b) => b.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json("Ok");
  } else {
    res.status(404).json("Not found");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
