const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const path = require("path");

const notFoundMiddleware = require("./src/middleware/notFound");

const indexRouter = require("./src/routes");
const userApiRouter = require("./src/routes/api/user");
const bookApiRouter = require("./src/routes/api/book");
const bookRouter = require("./src/routes/book");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set("layout", "./layouts/index");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", userApiRouter);
app.use("/api/books", bookApiRouter);
app.use("/books", bookRouter);

app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
