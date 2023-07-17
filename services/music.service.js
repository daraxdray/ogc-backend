const { Music } = require("../models/Music");
const { getAlbumById } = require("./album.service");
const { getUserById } = require("./user.service");
var ObjectId = require("mongodb").ObjectId;

// GET ALL Music
exports.getMusic = async function (query, page, limit) {
  try {
    var content = await Music.find(query);
    return content;
  } catch (e) {
    throw Error("Error while fetching music");
  }
};

// GET Music BY ID
exports.getMusicById = async function (id) {
  try {
    var content = await Book.findById(id);
    return content;
  } catch (e) {
    throw Error("Error while finding music");
  }
};

//ADD MUSIC
exports.addMusic = async function (document) {
  try {
    var content = await Music.create(document);
    const album = await getAlbumById(document.albumId);
    album.songs.push(content);
    await album.save();
    return content;
  } catch (e) {
    console.log(e);
    throw Error(e, "Error adding new song to album");
  }
};

// REMOVE Music
exports.removeMusic = async function (id) {
  try {
    var content = await Music.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//SEARCH FOR Music BY TITLE OR DESCRIPTION
exports.getSearchResults = async function (text, page, limit) {
  try {
    Music.createIndexes({ title: text, artist: text });
    const query = { $text: { $search: text } };
    var content = await Music.find(query);
    return content;
  } catch (e) {
    throw Error(e + "Error while fetching search results");
  }
};

//Update MUSIC
exports.updateMusic = async function (id, data) {
  try {
    var content = await Music.findByIdAndUpdate(id, data);
    return content;
  } catch (e) {
    throw Error("Error while updating Music");
  }
};

//Get Random 3 Music
exports.getRandom = async function () {
  try {
    var content = await Music.find().skip(1).limit(1);
    return content;
  } catch (e) {
    throw Error(e);
  }
};
//get song reviews
exports.getReviewsBySongId = async function (id) {
  try {
    var result = [];
    var final_result = [];
    var content = await Music.findById(id);
    console.log("haaa", content.reviews);
    result = content.reviews;
    for (review of result) {
      if (review.isApproved == true) {
        const user = await getUserById(review.user);
        this.fullname = user.firstname + " " + user.lastname;
        console.log("FULLNAME IS ", this.fullname);
        this.userpicture = user.photo;
        final_result.push({
          fullname: this.fullname,
          userpicture: this.userpicture,
          comment: review.comment,
          rating: review.rating,
          createdAt: review.createdAt,
        });
      }
    }
    console.log(final_result);
    return final_result;
  } catch (e) {
    throw Error(e);
  }
};
exports.findMusicByAlbum = async function (albumId) {
  try {
    var content = await Music.find({ albumId: albumId });
    return content;
  } catch (e) {
    throw Error("Couldnt find Music");
  }
};
exports.getMusicReviews = async function (id) {
  try {
    var content = await Music.findById(id);
    return content.reviews;
  } catch (e) {
    throw Error(e);
  }
};

exports.removeMusicReview = async function (id, reviewId) {
  try {
    await Music.updateOne(
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
exports.updateMusicReview = async function (id, review) {
  try {
    await Music.findOneAndUpdate(
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
