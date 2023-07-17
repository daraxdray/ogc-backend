const { Book } = require("../models/Book");
const { Music } = require("../models/Music");
const { Podcast } = require("../models/Podcast");
const { Episode } = require("../models/Episode");
const { Review } = require("../models/Review");
const User = require("../models/User");
var ObjectId = require('mongodb').ObjectId;
const userService = require('./user.service');

exports.getReviews = async function (query, page, limit) {
  try {
    var reviews = await Review.find(query);
    return reviews;
  } catch (e) {
    throw Error("Error finding reviews");
  }
};

exports.getReviews = async function (query, page, limit) {
    try {
        var reviews = await Review.find();
        return reviews;
    }
    catch (e) {
        throw Error("Error finding reviews")
    }
}

exports.getReviewById = async function (id) {
  try {
      var review = await Review.findById(id);
      return review;
  }
  catch (e) {
      throw Error("Error while finding review", e)
  }
}

exports.addReview = async function (document) {
  try {
      var content = await Review.create(document);
      if (content.book) {
          const book = await Book.findById(content.book);
          book.reviews.push(content);
          await book.save();
      }
      if (document.podcast) {
          const podcast = await Podcast.findById(document.podcast);
          podcast.reviews.push(content);
          await podcast.save();
      }
      if (document.music) {
          const music = await Music.findById(document.music);
          music.reviews.push(content);
          await music.save();
      }
      if (document.episode) {
        const episode = await Episode.findById(document.episode);
        episode.reviews.push(content);
        await episode.save();
    }
      return content;
  } catch (e) {
      console.log(e);
      throw Error(e + "Error while adding new Review");
  }
};


exports.removeReview = async function (id) {
    try {
        var content = await Review.deleteMany({ 'id': id });
    } catch (e) {
        throw Error(e + " : Error while deleting review");
    }
};

exports.updateReview = async function (id, data) {
    try {
        var content = await Review.findByIdAndUpdate(id, data);
        return content;

    } catch (e) {
        throw Error("Error while updating review");
    }
};

exports.getReviewsByBookId = async function (id) {
    try {
        const reviews = await Review.find({ 'book': ObjectId(id) });
        return reviews;
    }
    catch (e) {
        console.log(e);
        throw Error("Error while retrieveing reviews", e);
    }
}
exports.getReviewsBySongId = async function (id) {
    let reviews = [];
    await Review.find({ 'isApproved': true }, { 'music': ObjectId(id) }).then((res) => { reviews = res; console.log("aaaaaaaaaa", res) }).catch((err) => { console.log(err); throw (err) });
}



