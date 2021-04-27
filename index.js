const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const notFoundMiddleware = require("./src/middleware/notFound");

const indexRouter = require("./src/routes");
const userRouter = require("./src/routes/user");
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
app.use("/user", userRouter);
app.use("/books", bookRouter);

app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || "root";
const PasswordDB = process.env.DB_PASSWORD || "AXRHV]cy?s/4UkZ";
const NameDB = process.env.DB_NAME || "books_database";
const HostDB = process.env.DB_HOST || "mongodb://localhost:27017/";
async function start() {
  try {
    const UrlDB = `mongodb+srv://${UserDB}:${PasswordDB}@cluster0.m4q9c.mongodb.net/${NameDB}?retryWrites=true&w=majority`;
    await mongoose.connect(encodeURI(UrlDB), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Подключение в Docker контейнере
    /*await mongoose.connect(HostDB, {
      user: UserDB,
      pass: PasswordDB,
      dbName: NameDB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
