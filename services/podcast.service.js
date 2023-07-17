const { Episode } = require("../models/Episode");
const { Podcast } = require("../models/Podcast");

// GET ALL Podcasts
exports.getPodcasts = async function (query, page, limit) {
  try {
    var content = await Podcast.find(query).select(["-episodes.streamUri"]);
    return content;
  } catch (e) {
    throw Error("Error while fetching Podcasts");
  }
};

// GET Podcast BY ID
exports.getPodcastById = async function (id) {
  try {
    var content = await Podcast.findById(id);
    return content;
  } catch (e) {
    throw Error("Error while finding Podcast");
  }
};

//ADD Podcast
exports.addPodcast = async function (document) {
  try {
    //console.log('document is ===========',document);
    var content = await Podcast.create(document);
    return content;
  } catch (e) {
    console.log(e);
    throw Error("Error adding new Podcast");
  }
};

// REMOVE Podcast
exports.removePodcast = async function (id) {
  try {
    var content = await Podcast.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//SEARCH FOR Podcast BY TITLE OR DESCRIPTION
exports.getSearchResults = async function (text, page, limit) {
  try {
    Podcast.createIndexes({ title: text, description: text, host: text });
    const query = { $text: { $search: text } };
    var content = await Podcast.find(query);
    return content;
  } catch (e) {
    throw Error(e + "Error while fetching search results");
  }
};

//Update PODCAST
exports.updatePodcast = async function (id, data) {
  try {
    var content = await Podcast.findByIdAndUpdate(id, data);
    return content;
  } catch (e) {
    throw Error("Error while updating Podcast");
  }
};

//Get Random 3 PODCASTS
exports.getRandom = async function () {
  try {
    var content = await Podcast.find().skip(1).limit(1);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

exports.getPodcastReviews = async function (id) {
  try {
    var content = await Podcast.findById(id);
    return content.reviews;
  } catch (e) {
    throw Error(e);
  }
};

exports.removePodcastReview = async function (id, reviewId) {
  try {
    await Podcast.updateOne(
      { _id: id },
      {
        $pull: {
          reviews: {
            _id: reviewId,
          },
        },
      }
    );
  } catch (e) {
    throw Error(e);
  }
};
exports.updatePodcastReview = async function (id, review) {
  try {
    await Podcast.findOneAndUpdate(
      { _id: id, "reviews._id": review._id },
      {
        $set: {
          "reviews.$.isApproved": review.isApproved,
        },
      }
    );
  } catch (e) {
    throw Error(e);
  }
};

exports.getPodcastReviewsAverage = async function (id) {
  try {
    var podcast = await Podcast.findById(id);
    // .populate({
    //   path: "episodes",
    //   populate: {
    //     path: "reviews",
    //   },
    // });
    var reviewsSum = 0;
    var reviewsNb = 0;
    for (let ep of podcast.episodes) {
      var episode = await Episode.findById(ep._id);
      for (let review of episode.reviews) {
        if (review.isApproved) {
          reviewsSum += review.rating;
          reviewsNb++;
        }
      }
    }
    return Math.round(reviewsSum / reviewsNb);
  } catch (e) {
    throw Error(e);
  }
};
