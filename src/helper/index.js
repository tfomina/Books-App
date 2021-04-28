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

module.exports = { deleteFileFromDisk };
