const { Episode } = require("../models/Episode");
const { Podcast } = require("../models/Podcast");
const { getPodcastById } = require("./podcast.service");
const { getUserById } = require("./user.service");
var ObjectId = require("mongodb").ObjectId;

// GET ALL Episodes
exports.getEpisodes = async function (query, page, limit) {
  try {
    var content = await Episode.find(query);
    return content;
  } catch (e) {
    throw Error("Error while fetching Episodes");
  }
};

// GET Episode BY ID
exports.getEpisodeById = async function (id) {
  try {
    var content = await Episode.findById(id);
    return content;
  } catch (e) {
    throw Error("Error while finding Episode");
  }
};

exports.getEpisodeByPodcastId = async function (id) {
  try {
    var content = await Episode.find({ podcastId: id }).select(["-streamUri"]);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//ADD Episode
exports.addEpisode = async function (document) {
  try {
    var content = await Episode.create(document);
    const podcast = await getPodcastById(document.podcastId);
    podcast.episodes.push(content);
    await podcast.save();
    return content;
  } catch (e) {
    console.log(e);
    throw Error("Error adding new Episode");
  }
};

// REMOVE Episode
exports.removeEpisode = async function (id) {
  try {
    var content = await Episode.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//SEARCH FOR Episode BY TITLE OR DESCRIPTION
exports.getSearchResults = async function (text, page, limit) {
  try {
    Episode.createIndexes({ title: text, description: text, artist: text });
    const query = { $text: { $search: text } };
    var content = await Episode.find(query);
    return content;
  } catch (e) {
    throw Error(e + "Error while fetching search results");
  }
};

//Update Episode
// exports.updateEpisode = async function (id, data) {
//     try {
//         var content = await Episode.findByIdAndUpdate(id, data);
//         return content;
//     } catch (e) {
//         throw Error("Error while updating Episode");
//     }
// };

//Update Episode
exports.updateEpisode = async function (id, data) {
  try {
    var content = await Episode.findByIdAndUpdate(id, data);
    await content.save();

    var podcast = await Podcast.findById(content.podcastId);

    await podcast.episodes.forEach((element, index) => {
      if (element._id.equals(content._id)) {
        console.log("got it");
        podcast.episodes[index] = content;
      }
    });
    //console.log(foundIndex);
    //podcast.episodes[foundIndex] = content;
    await podcast.save();
    return content;
  } catch (e) {
    console.log(e);
    throw Error("Error while updating Episode");
  }
};

exports.getEpisodeReviews = async function (id) {
  try {
    var result = [];
    var final_result = [];
    var content = await Episode.findById(id);
    console.log("haaa", content);
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
exports.removeEpisodeReview = async function (id, reviewId) {
  try {
    await Episode.updateOne(
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
exports.updateEpisodeReview = async function (id, review) {
  try {
    await Episode.findOneAndUpdate(
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

// exports.getEpisodeReviews = async function (id) {
//   try {
//     var content = await Episode.findById(id);
//     return content.reviews;
//   } catch (e) {
//     throw Error(e);
//   }
// };
