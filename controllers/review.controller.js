const User = require("../models/User");
const ReviewService = require("../services/review.service");

exports.getReviews = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await ReviewService.getReviews( page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully Retrieved Reviews",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.addReview = async function (req, res, next) {
  try {
    var review = {
      user: req.body.user,
      comment: req.body.comment,
      rating: req.body.rating,
    }

    //checks what the review is for
    if (req.body.bookId) {
      review.book = req.body.bookId
    }
    if (req.body.podcastId) {
      review.podcast = req.body.podcastId
    }
    if (req.body.episodeId) {
      review.episode = req.body.episodeId
    }
    if (req.body.musicId) {
      review.music = req.body.musicId
    }
    var content = await ReviewService.addReview(review);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Review added succesfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.updateReview = async function (req, res, next) {
  try {
    var content = await ReviewService.updateReview(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Review succesfully updated",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.removeReview = async function (req, res, next) {
  try {
    var content = await ReviewService.removeReview(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Review succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getReviewByid = async function (req, res, next) {
  try {
    var content = await ReviewService.getReviewById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Review succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getReviewsByBookId = async function (req, res) {
  try {
    var reviews = await ReviewService.getReviewsByBookId(req.params.id);
    console.log(reviews)
    return reviews;
  }
  catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
}
exports.getReviewsBySongId = async function (req, res) {
  let reviews = [];
  await ReviewService.getReviewsBySongId(req.params.id).then((res) => {
    reviews = res;
    console.log("IS IT HERE", reviews)
  }).catch((err) => { console.log(err); throw (err) });

}




