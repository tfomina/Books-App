const multer = require("multer");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/files");
  },
  filename(req, file, cb) {
    const { fileName } = req.body;
    const extention = file.originalname.split(".").pop();
    cb(null, `${fileName.replace(/\s/g, "-")}-${nanoid()}.${extention}`);
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
