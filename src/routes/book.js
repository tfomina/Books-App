const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const { Book } = require("../models");
const fileMiddleware = require("../middleware/file");

// получить все книги
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().select("_id, title");
    res.render("books/index", { title: "Книги", books: books });
  } catch (err) {
    console.log(err);
    res.status(404).redirect("/404");
  }
});

// открыть форму создания книги
router.get("/create", (req, res) => {
  res.render("books/create", { title: "Создание книги", book: {} });
});

// сохранить книгу
router.post("/create", fileMiddleware.single("fileBook"), async (req, res) => {
  const { title, description, authors, favorite, fileCover } = req.body;

  let fileBook = "",
    fileName = "";
  if (req.file) {
    const { path, filename } = req.file;
    fileBook = path;
    fileName = filename;
  }

  const newBook = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });

  try {
    await newBook.save();
    res.redirect("/books");
  } catch (err) {
    console.log(err);
  }
});

// получить книгу по id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let book, counter;

  try {
    book = await Book.findById(id);
  } catch (err) {
    console.log(err);
    res.status(404).redirect("/404");
  }

  if (book) {
    try {
      const baseUrl = `http://${process.env.COUNTER_SERVER_HOST}:${process.env.COUNTER_SERVER_PORT}/counter/`;

      await axios.post(`${baseUrl}/${book.id}/incr`); // добавить +1 к счетчику
      const response = await axios.get(`${baseUrl}/${book.id}`); // получить счетчик
      counter = response.data?.counter;
    } catch (e) {
      console.log(e);
    }
  }

  res.render("books/view", {
    title: "Просмотр книги",
    book: book,
    counter: counter,
  });
});

// получить книгу по id для редактирования
router.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);
    res.render("books/update", { title: "Редактирование книги", book: book });
  } catch (err) {
    console.log(err);
    res.status(404).redirect("/404");
  }
});

// редактировать книгу по id
router.post(
  "/update/:id",
  fileMiddleware.single("fileBook"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover } = req.body;

    let fileBook = "",
      fileName = "";
    if (req.file) {
      const { path, filename } = req.file;
      fileBook = path;
      fileName = filename;
    }

    try {
      await Book.findByIdAndUpdate(id, {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
      });
      res.redirect(`/books/${id}`);
    } catch (err) {
      console.log(err);
      res.status(404).redirect("/404");
    }
  }
);

// удалить книгу по id
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    const { fileBook } = book;

    // удаление файла книги
    if (fileBook) {
      fs.unlinkSync(fileBook);
    }

    // удаление записи из БД
    await Book.deleteOne({ _id: id });

    res.redirect("/books");
  } catch (err) {
    console.log(err);
    res.status(404).redirect("/404");
  }
});

// скачать книгу по id
router.get("/:id/download", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    const { fileBook } = book;

    res.download(path.join(__dirname, "..", fileBook), fileName, (err) => {
      if (err) {
        res.status(404).redirect("/404");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(404).redirect("/404");
  }
});

module.exports = router;
