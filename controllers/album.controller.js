const { Album } = require("../models/Album");
const AlbumService = require("../services/album.service");
const multer = require("multer");
var fileUpload = require("../config/multer-config");
const { validationResult } = require("express-validator");
const { sendPushNotification } = require("../utils/sendPushNotification");
const ReviewService = require("../services/review.service");

// GET ALL Albums
exports.getAlbums = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await AlbumService.getAlbums({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved Albums",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//ADD An Album
exports.addAlbum = async (req, res, next) => {
  try {
    var u = multer({
      storage: fileUpload.files.storage(),
      allowedFile: fileUpload.files.allowedFile,
    }).single("cover");
    u(req, res, function (err) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).send(firstError);
      }
      const newAlbum = new Album({
        title: req.body.title,
        artist: req.body.artist,
        description: req.body.description,
        price: req.body.price,
        release_date: req.body.release_date,
        priceId: req.body.priceId,
      });
      if (req.file) {
        console.log(req.file);
        newAlbum.cover = req.file.filename;
      }
      //saving the user
      newAlbum.save((err, album) => {
        console.log(album);
        if (err) {
          console.log(err);
          return res.status(401).send(err, "error creating the album");
        } else {
          sendPushNotification(
            "album",
            "New album added",
            "Check out the newly added ablum: " +
              req.body.title +
              " by " +
              req.body.artist
          );
          res.status(200).send(album);
        }
      });
    });
  } catch (error) {
    res.status(500).send(error, "internal server error");
  }
};

// Update an album
exports.updateAlbum = async function (req, res, next) {
  try {
    var content = await AlbumService.updateAlbum(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "ALBUM succesfully updated",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.removeAlbum = async function (req, res, next) {
  try {
    var content = await AlbumService.removeAlbum(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Album succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getAlbumtById = async function (req, res, next) {
  try {
    var content = await AlbumService.getAlbumById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "ALBUM succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getLatestAlbum = async function (req, res, next) {
  try {
    var content = await Album.findOne().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found Album",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// Find random 3
exports.getRandomAlbums = async function (req, res) {
  try {
    var content = await AlbumService.getRandomAlbums();
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Successfully retrieved 3 random Albums",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
exports.getAlbumReviews = async function (req, res, next) {
  try {
    var content = await AlbumService.getAlbumReviews(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Album reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.removeAlbumReview = async function (req, res) {
  try {
    await AlbumService.removeAlbumReview(req.params.id, req.body.reviewId).then(
      ReviewService.removeReview(req.body.reviewId)
    );
    return res.status(200).json("Successfully deleted");
  } catch (e) {
    throw Error(e);
  }
};

exports.updateAlbumReview = async function (req, res) {
  try {
    await AlbumService.updateAlbumReview(req.params.id, req.body).then(
      ReviewService.updateReview(req.body._id, req.body)
    );
    return res.status(200).json("Successfully updated");
  } catch (e) {
    throw Error(e);
  }
};

exports.getAlbumReviewsAverage = async function (req, res, next) {
  try {
    var content = await AlbumService.getAlbumReviewsAverage(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Album reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
