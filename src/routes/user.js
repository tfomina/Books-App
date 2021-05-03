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

// авторизация пользователя
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const areSame = await bcrypt.compare(password, user.passwordHash);

      if (areSame) {
        res.redirect("/");
      } else {
        res.render("user/login", {
          title: "Вход",
          btnTitle: "Войти",
          user: { email, password },
          error: "Неверный логин или пароль",
        });
      }
    } else {
      res.render("user/login", {
        title: "Вход",
        btnTitle: "Войти",
        user: { email, password },
        error: "Пользователь не найден",
      });
    }
  } catch (err) {
    console.log(err);

    res.render("user/login", {
      title: "Вход",
      btnTitle: "Войти",
      user: { email, password },
      error: "Ошибка авторизации",
    });
  }
});

router.get("/profile", (req, res) => {
  res.render("user/profile", {
    title: "Профиль пользователя",
  });
});

module.exports = router;
