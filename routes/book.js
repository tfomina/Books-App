const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { Book } = require("../models");
const fileMiddleware = require("../middleware/file");

const store = {
  books: [],
};

// TODO Удалить
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
  res.render("books/index", { title: "Книги", books: books });
});

// открыть форму создания книги
router.get("/create", (req, res) => {
  res.render("books/create", { title: "Создание книги", book: {} });
});

// сохранить книгу
router.post("/create", fileMiddleware.single("fileBook"), (req, res) => {
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

  res.redirect("/books");
});

// получить книгу по id
router.get("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((book) => book.id === id);

  if (book) {
    res.render("books/view", { title: "Просмотр книги", book: book });
  } else {
    res.status(404).redirect("/404");
  }
});

// получить книгу по id для редактирования
router.get("/update/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((book) => book.id === id);

  if (book) {
    res.render("books/update", { title: "Редактирование книги", book: book });
  } else {
    res.status(404).redirect("/404");
  }
});

// редактировать книгу по id
router.post("/update/:id", fileMiddleware.single("fileBook"), (req, res) => {
  console.log("req ", req);
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
    res.redirect(`/books/${id}`);
  } else {
    res.status(404).redirect("/404");
  }
});

// удалить книгу по id
router.post("/delete/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const book = books.find((book) => book.id === id);

  if (book) {
    store.books = store.books.filter((book) => book.id !== id);

    try {
      const { fileBook } = book;

      //fs.unlinkSync(fileBook); //TODO раскомментировать
    } catch (err) {
      throw new Error(`Ошибка при удалении книги: ${err}`);
    }

    res.redirect("/books");
  } else {
    res.status(404).redirect("404");
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
