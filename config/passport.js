const router = require("express").Router();
const passport = require("passport");
const { SocialUser } = require("../models/SocialUser");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const { compareSync } = require("bcrypt");
const UserService = require("../services/user.service");
passport.use(
  new FacebookStrategy(
    {
      clientID: "510760704163127",
      clientSecret: "e14f2e21bf0d243f7c7a4632c4ac9bbe",
      callbackURL:
        "https://database.ogcpublications.com/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "picture"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await SocialUser.findOne({
        email: profile._json.email,
      });
      if (!user) {
        const newUser = new SocialUser({
          id: profile._json.id,
          email: profile._json.email,
          firstname: profile._json.first_name,
          lastname: profile._json.last_name,
          picture: profile.photos[0].value,
          provider: profile.provider,
        });
        const saveduser = await newUser.save();
      } else {
      }

      return cb(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "970536332592-gph4prujlv3hls0ptgvq844cedcq805m.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL:
        "https://database.ogcpublications.com/oauth2/redirect/google",
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await SocialUser.findOne({
        email: profile._json.email,
      });
      if (!user) {
        const newUser = new SocialUser({
          id: profile._json.sub,
          email: profile._json.email,
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          picture: profile._json.picture,
          provider: profile.provider,
        });
        const saveduser = await newUser.save();
      } else {
      }
      return done(null, profile);
    }
  )
);
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  async function (req, res) {
    const user = await User.findOne({
      email: req.session.passport.user._json.email,
    });
    if (user) {
      res.redirect(`http://174.138.102.94:80/myprofile/${user._id}`);
    } else {
      res.redirect(
        `http://174.138.102.94:80/signup/${req.session.passport.user.id}`
      );
    }
  }
);
router.get("/google/success", (req, res) => {
  res.status(200).json(req.session.passport.user._json);
});
router.get("/facebook/success", (req, res) => {
  res.status(200).json(req.session.passport.user._json);
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/facebook" }),
  async function (req, res) {
    // Successful authentication, redirect home.

    const user = await User.findOne({
      email: req.session.passport.user._json.email,
    });
    if (user) {
      res.redirect(`http://174.138.102.94:80/myprofile/${user._id}`);
    } else {
      res.redirect(
        `http://174.138.102.94:80/signup/${req.session.passport.user.id}`
      );
    }
  }
);
router.get("/socialuser/:id", async function (req, res) {
  try {
    const user = await SocialUser.findOne({
      id: req.params.id,
    });
    if (!user) {
      res.status(400).json("user not found");
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
p = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (username, password, done) => {
       await User.findOne({ email: username }, function (err, user) {
          if (err) {
            console.log(err);
            return done(err);
          } //When some error occurs

          if (!user) {
            //When email is invalid
            return done(null, false, { message: "Incorrect username." });
          }

          if (!compareSync(password, user.password)) {
            //When password is invalid
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        });
      }
    )
  );
};
passport.use(
  new CustomStrategy(function (req, done) {
    User.findOne(
      {
        email: req.body.email,
      },
      function (err, user) {
        done(err, user);
      }
    );
  })
);

router.post(
  "/social-auth-mobile",
  passport.authenticate("custom", {}),
  async function (req, res) {
    const user = req.session.passport.user;
    //console.log(user);
    if (user !== null) {
      return res.status(200).json({
        status: 200,
        data: user,
        message: "social auth success",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "social auth failed",
      });
    }
  }
);

module.exports = { router, p };
