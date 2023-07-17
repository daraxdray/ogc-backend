const User = require("../models/User");
const Token = require("../models/ResetToken");
const upload = require("../middleware/UploadMemoryStoarge");
var fileUpload = require("../config/multer-config");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { compareSync } = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const UserService = require("../services/user.service");
const { Book } = require('../models/Book');
const { Music } = require('../models/Music');
const { Podcast } = require('../models/Podcast');
const { Album } = require("../models/Album");
const { Episode } = require("../models/Episode");

exports.summary = async function (req, res, next) {
  try {
    const users = await User.countDocuments(); 
    const books = await Book.countDocuments(); 
    const musics = await Music.countDocuments(); 
    const podcasts = await Podcast.countDocuments(); 
    const albums = await Album.countDocuments(); 
    const episodes = await Episode.countDocuments(); 

    return res.status(200).json({
      users,
      episodes,
      episodes,
      books,
      musics,
      podcasts,
      albums,
      message: "User succesfully found",
    });
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

exports.editProfileInfo = async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      console.log("========= User is", user);
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.birthdate) {
        user.birth_date = req.body.birth_date;
      }
      if (req.body.gender) {
        user.gender = req.body.gender;
      }
      if (req.body.country) {
        user.country = req.body.country;
      }
      if (req.body.city) {
        user.city = req.body.city;
      }
      user.save((err, updatedUser) => {
        if (err) {
          console.log("User not updating", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        res.json(updatedUser);
      });
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

//edit profile picture
exports.editPicture = async (req, res) => {
  try {
    let gallery = [];
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      return res.status(400).json("user not found");
    }

    const files = req.files.Image;
    //console.log(files);
    files.forEach(async (file) => {
      let newFileName = `user/${file.originalname + "-" + Date.now()}$/ `;
      let publicURL = `https://storage.googleapis.com/ogcstoarge.appspot.com/${encodeURI(
        newFileName
      )}`;

      await gallery.push(publicURL);

      await upload.uploadFile(file, newFileName).catch((reject) => {
        console.log(reject);
      });
    });
    if (gallery.length > 0) {
      user.photo = gallery[0];
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json("no pic uploded");
    }
  } catch (err) {
    res.status(500).send(err, "internal server error");
  }
};

//modify password method
exports.modifyPassword = async (req, res) => {
  try {
    await User.findOne({ _id: req.params.id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      const comparePwd = bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      );

      //check if old password and confirmed new password are valid

      if (comparePwd && req.body.newPassword === req.body.confirmPassword) {
        user.password = req.body.newPassword;
        user.save((err, updatedUser) => {
          console.log(updatedUser);
          if (err) {
            console.log(err);
            return res.status(401).send("error updating user password");
          } else {
            return res.json({
              success: true,
              data: updatedUser,
              message: "Password update successful",
            });
          }
        });
      } else {
        return res.status(401).send("error updating user password");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

// REMOVE Music
exports.removeUser = async function (req, res, next) {
  try {
    var content = await UserService.removeUser(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "User Succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// Add MUSIC once it is purchased
exports.addMusicForUser = async (req, res) => {
  try {
    var updatedUser = await UserService.addMusic(req.user, req.params.id);
    return res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "User Succesfully Bought music",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// Add BOOK once it is purchased
exports.addBookForUser = async (req, res) => {
  try {
    var updatedUser = await UserService.addBook(req.user, req.params.id);
    return res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "User Succesfully Bought a BOOk",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// Add PODCAST once it is purchased
exports.addPodcastForUser = async (req, res) => {
  try {
    var updatedUser = await UserService.addPodcast(req.user, req.params.id);
    return res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "User Succesfully Bought a PODCAST",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getUserById = async function (req, res, next) {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      return res.status(200).json({
        status: 200,
        data: user,
        message: "User succesfully found",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: e.message,
      });
    }
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.sendContactEmail = async function (req, res, next) {
  try {
    sendEmail.sendContactEmail(req.body);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

exports.editDeviceToken = async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      console.log("========= User is", user);
      if (req.body.deviceToken) {
        user.deviceToken = req.body.deviceToken;
      }
      user.save((err, updatedUser) => {
        if (err) {
          console.log("User not updating", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        res.json(updatedUser);
      });
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.editLastLogin = async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      console.log("========= User is", user);
      if (req.body.lastLogin) {
        user.lastLogin = req.body.lastLogin;
      }
      user.save((err, updatedUser) => {
        if (err) {
          console.log("User not updating", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        res.json(updatedUser);
      });
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.getUserItemsByUserId = async function (req, res, next) {
  if (req.params.id !== undefined) {
    try {
      const user = await UserService.getUserItemsByUserId(req.params.id);
      if (user) {
        return res.status(200).json({
          status: 200,
          data: user,
          message: "User items found",
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: e.message,
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message,
      });
    }
  } else {
    return res.status(400).json({
      status: 400,
      message: "User id is undefined",
    });
  }
};
exports.getEmailByFbId = async function (req, res, next) {
  try {
    const email = await UserService.getEmailByFbId(req.params.id);
    if (email != null) {
      return res.status(200).json({
        status: 200,
        data: email,
        message: "email by fb id found",
      });
    } else {
      return res.status(400).json({
        status: 401,
        message: "account not found",
      });
    }
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// added for mobile password reset
exports.forgetPassword = async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }

      //check if old password and confirmed new password are valid
      const checkUser = user.email == req.body.email;
      if (checkUser && req.body.newPassword) {
        user.password = req.body.newPassword;
        user.save((err, updatedUser) => {
          console.log(updatedUser);
          if (err) {
            console.log(err);
            return res.status(401).send("error updating user password");
          } else {
            return res.json({
              success: true,
              message: "Password update successful",
            });
          }
        });
      } else {
        return res.status(401).send("error updating user password");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
//check if email exists (added for apple sign in workflow)
exports.checkEmail = async (req, res) => {
  try {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User is found",
      });
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
