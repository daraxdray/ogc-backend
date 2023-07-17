const { Episode } = require("../models/Episode");
const EpisodeService = require("../services/episode.service");
const { sendPushNotification } = require("../utils/sendPushNotification");
const ReviewService = require("../services/review.service");

// GET ALL Episodes
exports.getEpisodes = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await EpisodeService.getEpisodes({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved Episodes",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//Get episodes by podcast ID

exports.getEpisodeByPodcastId = async function (req, res, next) {
  try {
    var content = await EpisodeService.getEpisodeByPodcastId(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Episodes succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//ADD A Episode
exports.addEpisode = async function (req, res, next) {
  try {
    var content = await EpisodeService.addEpisode({
      title: req.body.title,
      description: req.body.description,
      streamUri: req.body.streamUri,
      podcastId: req.body.podcastId,
      sampleUri: req.body.sampleUri,
    });
    sendPushNotification(
      "episode",
      "New episode added",
      "Check out the newly added episode: " + req.body.title
    );
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Episode added succesfully",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.updateEpisode = async function (req, res, next) {
  try {
    var content = await EpisodeService.updateEpisode(req.params.id, req.body);

    return res.status(200).json({
      status: 200,
      data: content,
      message: "Episode succesfully updated",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.removeEpisode = async function (req, res, next) {
  try {
    var content = await EpisodeService.removeEpisode(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Episode succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getEpisodeById = async function (req, res, next) {
  try {
    var content = await EpisodeService.getEpisodeById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Episode succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getLatestEpisode = async function (req, res, next) {
  try {
    var content = await Episode.findOne().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found Episode",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// Get reviews by episode ID
exports.getEpisodeReviews = async function (req, res, next) {
  try {
    var content = await EpisodeService.getEpisodeReviews(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found reviews",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.updateEpisodeReview = async function (req, res) {
  try {
    await EpisodeService.updateEpisodeReview(req.params.id, req.body).then(
      ReviewService.updateReview(req.body._id, req.body)
    );
    return res.status(200).json("Successfully updated ");
  } catch (e) {
    throw Error(e);
  }
};
