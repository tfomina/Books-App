const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models");
const passport = require("../passport/setup");

// страница с формой регистрации
router.get("/register", (req, res) => {
  res.render("user/register", {
    title: "Регистрация",
    btnTitle: "Зарегистрироваться",
    user: {},
    error: "",
  });
});

// регистрация пользователя
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const candidate = await User.findOne({ email });

    if (candidate) {
      res.render("user/register", {
        title: "Регистрация",
        btnTitle: "Зарегистрироваться",
        user: { name, email, password },
        error: `Email ${email} уже занят`,
      });
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
    res.render("user/register", {
      title: "Регистрация",
      btnTitle: "Зарегистрироваться",
      user: { name, email, password },
      error: "Ошибка при регистрации пользователя",
    });

    console.log(err);
  }
});

// страница с формой входа
router.get("/login", (req, res) => {
  res.render("user/login", {
    title: "Вход",
    btnTitle: "Войти",
    user: {},
    error: "",
  });
});

// залогивание пользователя
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.render("user/login", {
        title: "Вход",
        btnTitle: "Войти",
        user: { email, password },
        error: info?.message || "",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
});

// выход
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// профиль
router.get("/profile", (req, res) => {
  res.render("user/profile", {
    title: "Профиль пользователя",
  });
});

module.exports = router;
