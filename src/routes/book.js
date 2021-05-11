const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

const { Book } = require("../models");
const fileMiddleware = require("../middleware/file");
const { deleteFileFromDisk } = require("../helper");

// получить все книги
router.get("/", async (req, res) => {
  let books;

  try {
    books = await Book.find().select("_id, title");
  } catch (err) {
    console.log(err);
  }

  res.render("books/index", { title: "Книги", books: books });
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

  const book = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });

  try {
    await book.save();
    res.redirect("/books");
  } catch (err) {
    console.log(err);
    deleteFileFromDisk(fileBook);
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
  }

  if (book) {
    try {
      const baseUrl = `http://${process.env.COUNTER_SERVER_HOST}:${process.env.COUNTER_SERVER_PORT}/counter/`;

      await axios.post(`${baseUrl}/${book.id}/incr`); // добавить +1 к счетчику
      const response = await axios.get(`${baseUrl}/${book.id}`); // получить счетчик
      counter = response.data?.counter;
    } catch (err) {
      console.log(err);
    }

    res.render("books/view", {
      title: "Просмотр книги",
      book: book,
      counter: counter,
      currentUser: req.user,
    });
  } else {
    res.status(404).redirect("/404");
  }
});

// получить книгу по id для редактирования
router.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (book) {
    res.render("books/update", { title: "Редактирование книги", book: book });
  } else {
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
      deleteFileFromDisk(fileBook);
      res.status(404).redirect("/404");
    }
  }
);

// удалить книгу по id
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  let book;

  try {
    book = await Book.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (book) {
    // удаление файла книги
    const { fileBook } = book;
    deleteFileFromDisk(fileBook);

    // удаление записи из БД
    try {
      await Book.deleteOne({ _id: id });
    } catch (err) {
      console.error(err);
    }

    res.redirect("/books");
  } else {
    res.status(404).redirect("/404");
  }
});

// скачать книгу по id
router.get("/:id/download", async (req, res) => {
  const { id } = req.params;

  let book;

  try {
    book = await Book.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (book) {
    const { fileBook, fileName } = book;

    res.download(
      path.join(__dirname, "..", "..", fileBook),
      fileName,
      (err) => {
        if (err) {
          console.log(err);
          res.redirect(`/books/${book.id}`);
        }
      }
    );
  } else {
    res.status(404).redirect("/404");
  }
});

module.exports = router;
