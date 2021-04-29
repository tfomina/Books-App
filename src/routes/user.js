const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models");

// страница с формой регистрации
router.get("/register", (req, res) => {
  res.render("user/register", {
    title: "Регистрация",
    btnTitle: "Зарегистрироваться",
    user: {},
  });
});

// регистрация пользователя
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let candidate;
  try {
    candidate = await User.findOne({ email });

    if (candidate) {
      res.send(`Email ${email} уже занят`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        passwordHash,
      });

      await user.save();
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

// страница с формой входа
router.get("/login", (req, res) => {
  res.render("user/login", { title: "Вход", btnTitle: "Войти", user: {} });
});

// авторизация пользователя
router.post("/login", (req, res) => {});

router.get("/profile", (req, res) => {
  res.render("user/profile", {
    title: "Профиль пользователя",
  });
});

module.exports = router;
