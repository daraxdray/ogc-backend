const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { loginRequired } = require("../middleware/auth");
const upload = require("../middleware/upload");

//edit profile info
router.put("/edit/:id", loginRequired, userController.editProfileInfo);

//edit profile picture
router.put(
  "/edit/photo/:id",
  upload.fields([
    {
      name: "Image",
      maxCount: 1,
    },
  ]),
  loginRequired,
  userController.editPicture
);

//edit user password
router.put("/edit/password/:id", loginRequired, userController.modifyPassword);

//edit user password
router.delete("/remove/:id", userController.removeUser);

//add MUSIC to User collection when he buys
router.post("/buy-music/:id", userController.addMusicForUser);

//add PODCAST to User collection when he buys
router.post("/buy-podcast/:id", userController.addPodcastForUser);

//add PODCAST to User collection when he buys
router.post("/buy-book/:id", userController.addBookForUser);

router.get("/summary", userController.summary);
// get User By Id
router.get("/:id", userController.getUserById);

// Send Contact Email
router.post("/contact", userController.sendContactEmail);

//
//router.get('/fullname/:id',userController.getFullname);
//edit device token
router.put(
  "/edit-device-token/:id",
  loginRequired,
  userController.editDeviceToken
);
//edit last login
router.put("/edit-last-login/:id", loginRequired, userController.editLastLogin);

// get User purchased items
router.get("/items/:id", userController.getUserItemsByUserId);

router.get("/fb-id/:id", userController.getEmailByFbId);
//resets password with email and id (added for mobile)
router.put("/forget-password/:id", userController.forgetPassword);
// check if email exists
router.post("/check-email/", userController.checkEmail);
module.exports = router;
