const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const usr = require("../models/user");
const Admin = require("../models/admin");

module.exports = function (passport) {
passport.use(
    'admin',
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match Admin
      Admin.findOne({
        email: email,
      }).then((admin) => {
        if (!admin) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, admin.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, admin);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );
  passport.use(
    'local',
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      usr.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );


  passport.serializeUser(function (userObject, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    let userGroup = "user";
    let userPrototype = Object.getPrototypeOf(userObject);

    if (userPrototype === usr.prototype) {
      userGroup = "user";
    } else if (userPrototype === Admin.prototype) {
      userGroup = "admin";
    }
    let sessionConstructor = new SessionConstructor(
      userObject.id,
      userGroup,
      ""
    );
    done(null, sessionConstructor);
  });
  /*
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
*/

  passport.deserializeUser(function (sessionConstructor, done) {
    if (sessionConstructor.userGroup == "user") {
      usr.findOne(
        {
          _id: sessionConstructor.userId,
        },
        "-localStrategy.password",
        function (err, user) {
          // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
        }
      );
    } else if (sessionConstructor.userGroup == "admin") {
      Admin.findOne(
        {
          _id: sessionConstructor.userId,
        },
        "-localStrategy.password",
        function (err, user) {
          // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
        }
      );
    }
  });
  function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }
};
