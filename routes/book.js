const express = require("express");
const router = express.Router();
const formData = require("express-form-data");

const { Book } = require("../models");
const fileMiddleware = require("../middleware/file");

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
    `Filename ${i}`,
    `FileBook ${i}`
  );
  store.books.push(newBook);
}

// получить все книги
router.get("/", (req, res) => {
  const { books } = store;
  res.json(books);
});

// получить книгу по id
router.get("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.filter((book) => book.id === id)[0];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json("Not found");
  }
});

// создать книгу
router.post("/", formData.parse(), (req, res) => {
  const { books } = store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  books.push(newBook);

  res.status(201).json(newBook);
});

// редактировать книгу по id
router.put("/:id", formData.parse(), (req, res) => {
  const { books } = store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
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
      fileBook,
    };
    res.json(books[idx]);
  } else {
    res.status(404).json("Not found");
  }
});

// удалить книгу по id
router.delete("/:id", (req, res) => {
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

// загрузка файлов
router.post("/upload-file", fileMiddleware.single("book-file"), (req, res) => {
  if (req.file) {
    const { path } = req.file;
    console.log(path);

    res.json(path);
  } else {
    res.json(null);
  }
});

module.exports = router;
