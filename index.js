const express = require("express");
const cors = require("cors");
const path = require("path");

const notFoundMiddleware = require("./middleware/notFound");

const indexRouter = require("./routes");
const userApiRouter = require("./routes/api/user");
const bookApiRouter = require("./routes/api/book");
const bookRouter = require("./routes/book");

const app = express();

app.set("view engine", "ejs");

app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", userApiRouter);
app.use("/api/books", bookApiRouter);
app.use("/books", bookRouter);

app.use(notFoundMiddleware);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.toString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
