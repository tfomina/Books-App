const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = require("./comment");
const { requiredMessage } = require("../helper");

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, requiredMessage],
  },
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String,
  comments: [CommentSchema],
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
