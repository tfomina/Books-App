const fs = require("fs");

const deleteFileFromDisk = (fileBook) => {
  if (fileBook) {
    try {
      fs.unlinkSync(fileBook);
    } catch (err) {
      console.error(err);
    }
  }
};

const requiredMessage = "Обязательное поле";

module.exports = { deleteFileFromDisk, requiredMessage };
