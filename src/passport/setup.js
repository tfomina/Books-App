const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  console.log("serializeUser user ", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    console.log("deserializeUser user ", user);
    done(err, user);
  });
});

const verify = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    console.log("verify user ", user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);

      console.log("verify isMatch ", isMatch);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Неверный логин или пароль" });
      }
    } else {
      return done(null, false, { message: "Пользователь не найден" });
    }
  } catch (err) {
    return done(null, false, { message: "Ошибка при входе на сайт" });
  }
};

const options = {
  usernameField: "email",
  passwordField: "password",
};

//  Добавление стратегии для использования
passport.use("local", new LocalStrategy(options, verify));

module.exports = passport;
