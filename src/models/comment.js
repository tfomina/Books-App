const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { requiredMessage } = require("../helper");

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, requiredMessage],
  },
  sentAt: { type: Date, required: [true, requiredMessage] },
  text: { type: String, required: [true, requiredMessage] },
});

module.exports = CommentSchema;
