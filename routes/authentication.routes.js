const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");
const auth = require("../middleware/auth");

//Login with email and password using passport
router.post(
  "/login",
  passport.authenticate("local", ),
  async function (req, res) {
    res.status(200).json(req.user);
  }
);
//logout
router.post("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    res.status(200).send("logout successful");
  } else {
    res.status(401).send("must be logged in");
  }
});
//logout admin
router.delete("/admin/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    res.status(200).send("logout successful");
  } else {
    res.status(401).send("must be logged in");
  }
});

router.get("/users", async (req, res) => {
  const users = await User.find({});
  return res.json({
    message: "users retrieved",
    data: users,
  });
});
router.get("/admins", async (req, res) => {
  const users = await User.find({ role: "admin" });
  return res.json({
    message: "users retrieved",
    data: users,
  });
});

//get logged in user
router.get("/sess", async (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  return res.status(400).send("session expired");
});

router.post("/testing", (req, res) => {
  if (req.user) {
    console.log(req.user.id);
  } else {
    console.log("not authenticated");
  }
  return;
});

// basic login with email and password
router.post("/signup", auth.signUp);
router.post("/signin", auth.signIn);

//send email with link to reset forgotten password
router.post("/reset-password", auth.sendToken);
router.post("/reset-old", auth.oldsend);
router.post("/reset-password-mobile", auth.sendTokenForMobile);

router.post("/validate-token", auth.validateToken);
module.exports = router;
