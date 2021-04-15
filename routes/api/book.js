const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { Book } = require("../../models");
const fileMiddleware = require("../../middleware/file");

const store = {
  books: [],
};

// получить все книги
router.get("/", (req, res) => {
  const { books } = store;
  res.json(books);
});

// получить книгу по id
router.get("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((book) => book.id === id);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json("Not found");
  }
});

// создать книгу
router.post("/", fileMiddleware.single("fileBook"), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover } = req.body;

  let fileBook = "",
    fileName = "";
  if (req.file) {
    const { path, filename } = req.file;
    fileBook = path;
    fileName = filename;
  }

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
router.put("/:id", fileMiddleware.single("fileBook"), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover } = req.body;

  let fileBook = "",
    fileName = "";
  if (req.file) {
    const { path, filename } = req.file;
    fileBook = path;
    fileName = filename;
  }

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

  const book = books.find((book) => book.id === id);

  if (book) {
    store.books = store.books.filter((book) => book.id !== id);

    try {
      const { fileBook } = book;

      fs.unlinkSync(fileBook);
    } catch (err) {
      throw new Error(`Ошибка при удалении книги: ${err}`);
    }

    res.json("Ok");
  } else {
    res.status(404).json("Not found");
  }
});

// скачать книгу по id
router.get("/:id/download", (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const book = books.filter((book) => book.id === id)[0];

  const { fileName, fileBook } = book;

  res.download(path.join(__dirname, "..", fileBook), fileName, (err) => {
    if (err) {
      res.status(404).json("Not Found");
    }
  });
});

module.exports = router;