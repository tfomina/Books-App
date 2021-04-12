const multer = require("multer");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/files");
  },
  filename(req, file, cb) {
    cb(null, `${nanoid()}-${file.originalname.replace(/\s/g, "-")}`);
  },
});

// .txt, .pdf, .doc, .docx, .epub, .fb2
const allowedFileTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/epub+zip",
  "application/fb2",
];

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
