const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { requiredMessage } = require("../helper");

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, requiredMessage],
    unique: true,
    dropDups: true,
  },
  passwordHash: {
    type: String,
    required: [true, requiredMessage],
  },
  name: {
    type: String,
    required: [true, requiredMessage],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
