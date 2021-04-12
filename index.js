const express = require("express");
const cors = require("cors");
const path = require("path");

const notFoundMiddleware = require("./middleware/notFound");

const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const bookRouter = require("./routes/book");

const app = express();

app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);

app.use(notFoundMiddleware);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.toString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
