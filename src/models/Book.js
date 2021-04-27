const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Название обязательно"],
  },
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String,
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
