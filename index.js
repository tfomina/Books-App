const express = require("express");
const cors = require("cors");
const formData = require("express-form-data");

const notFoundMiddleware = require("./middleware/notFound");

const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const bookRouter = require("./routes/book");

const app = express();

app.use(formData.parse());
app.use(cors());

app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);

app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
