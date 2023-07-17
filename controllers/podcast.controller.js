const { Podcast } = require("../models/Podcast");
const PodcastService = require("../services/podcast.service");
const multer = require("multer");
var fileUpload = require("../config/multer-config");
const { validationResult } = require("express-validator");
const { sendPushNotification } = require("../utils/sendPushNotification");
const ReviewService = require("../services/review.service");

// GET ALL Podcasts
exports.getPodcasts = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await PodcastService.getPodcasts({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved Podcasts",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//ADD A Podcast
exports.addPodcast = async (req, res, next) => {
  try {
    var u = multer({
      storage: fileUpload.files.storage(),
      allowedFile: fileUpload.files.allowedFile,
    }).single("photo");
    u(req, res, function (err) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).send(firstError);
      }
      const newPodcast = new Podcast({
        title: req.body.title,
        host: req.body.host,
        description: req.body.description,
        price: req.body.price,
        release_date: req.body.release_date,
        priceId: req.body.priceId,
        // episodes:req.body.episodes
      });
      if (req.body.priceIdMobile) {
        newPodcast.priceIdMobile = req.body.priceId;
      }
      if (req.file) {
        newPodcast.cover = req.file.filename;
      }
      //saving the user
      newPodcast.save((err, podcast) => {
        if (err) {
          return res.status(401).send(err, "error creating the podcast");
        } else {
          sendPushNotification(
            "podcast",
            "New podcast added",
            "Check out the newly added podcast: " +
              req.body.title +
              " by " +
              req.body.host
          );
          res.status(200).send(podcast);
        }
      });
    });
  } catch (error) {
    res.status(500).send(error, "internal server error");
  }
};

// Update a Podcast
exports.updatePodcast = async function (req, res, next) {
  try {
    var content = await PodcastService.updatePodcast(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Podcast succesfully updated",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.removePodcast = async function (req, res, next) {
  try {
    var content = await PodcastService.removePodcast(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Podcast succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getPodcastById = async function (req, res, next) {
  try {
    var content = await PodcastService.getPodcastById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Podcast succesfully found",
    });
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getLatestPodcast = async function (req, res, next) {
  try {
    var content = await Podcast.findOne().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found Podcast",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// Find random 3
exports.getRandomPodcasts = async function (req, res) {
  try {
    var content = await PodcastService.getRandom();
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Successfully retrieved 3 random PODCASTS",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
exports.removePodcastReview = async function (req, res) {
  try {
    await PodcastService.removePodcastReview(
      req.params.id,
      req.body.reviewId
    ).then(ReviewService.removeReview(req.body.reviewId));
    return res.status(200).json("Successfully deleted");
  } catch (e) {
    throw Error(e);
  }
};
exports.updatePodcastReview = async function (req, res) {
  try {
    await PodcastService.updatePodcastReview(req.params.id, req.body).then(
      ReviewService.updateReview(req.body._id, req.body)
    );
    return res.status(200).json("Successfully updated");
  } catch (e) {
    throw Error(e);
  }
};
exports.getPodcastReviews = async function (req, res, next) {
  try {
    var content = await PodcastService.getPodcastReviews(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Podcast reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getPodcastReviewsAverage = async function (req, res, next) {
  try {
    var content = await PodcastService.getPodcastReviewsAverage(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Podcast reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
