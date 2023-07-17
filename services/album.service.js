const { Album } = require("../models/Album");
const { Music } = require("../models/Music");

// GET ALL Albums
exports.getAlbums = async function (query, page, limit) {
  try {
    var content = await Album.find(query).select(["-songs.streamUri"]);
    return content;
  } catch (e) {
    throw Error("Error while fetching Albums");
  }
};

// GET Album BY ID
exports.getAlbumById = async function (id) {
  try {
    var content = await Album.findById(id);
    return content;
  } catch (e) {
    throw Error("Error while finding Album");
  }
};

//ADD Album
exports.addAlbum = async function (document) {
  try {
    //console.log('document is ===========',document);
    var content = await Album.create(document);
    return content;
  } catch (e) {
    console.log(e);
    throw Error("Error adding new Album");
  }
};

// REMOVE Album
exports.removeAlbum = async function (id) {
  try {
    var content = await Album.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//SEARCH FOR Album BY TITLE OR DESCRIPTION
exports.getSearchResults = async function (text, page, limit) {
  try {
    Album.createIndexes({ title: text, description: text, host: text });
    const query = { $text: { $search: text } };
    var content = await Album.find(query);
    return content;
  } catch (e) {
    throw Error(e + "Error while fetching search results");
  }
};

//Update Album
exports.updateAlbum = async function (id, data) {
  try {
    var content = await Album.findByIdAndUpdate(id, data);
    return content;
  } catch (e) {
    throw Error("Error while updating Album");
  }
};

//Get Random 3 Albums
exports.getRandom = async function () {
  try {
    var content = await Album.find().skip(1).limit(1);
    return content;
  } catch (e) {
    throw Error(e);
  }
};
exports.getAlbumReviews = async function (id) {
  try {
    var content = await Album.findById(id);
    return content.reviews;
  } catch (e) {
    throw Error(e);
  }
};

exports.removeAlbumReview = async function (id, reviewId) {
  try {
    await Album.updateOne(
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

exports.updateAlbumReview = async function (id, review) {
  try {
    await Album.findOneAndUpdate(
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

exports.getAlbumReviewsAverage = async function (id) {
  try {
    var album = await Album.findById(id);
    // .populate({
    //   path: "songs",
    //   populate: {
    //     path: "reviews",
    //   },
    // });
    var reviewsSum = 0;
    var reviewsNb = 0;
    for (let song of album.songs) {
      var music = await Music.findById(song._id);
      for (let review of music.reviews) {
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
