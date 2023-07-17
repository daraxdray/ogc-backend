const MusicService = require("../services/music.service");
var { Music } = require("../models/Music");
const { sendPushNotification } = require("../utils/sendPushNotification");
const ReviewService = require("../services/review.service");

// GET ALL Music
exports.getMusic = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await MusicService.getMusic({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved Music",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//ADD A Music
exports.addSMusic = async function (req, res, next) {
  try {
    const { title, artist, price, albumId, duration, albumImageUrl } = req.body;
    //SAVING THE MP3 FILE TO AWS
    const s3Song = await new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `songs/${albumId}/${req.files.song[0].originalname}`,
        Body: req.files.song[0].buffer,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      });
    });
    //TRIM THE SONG AND SAVE IT AGAIN
    const s3SongSample = await new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `songs/${albumId}/sample/${req.files.sample[0].originalname}`,
        Body: req.files.sample[0].buffer,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      });
    });
    const stripeProduct = await stripe.products.create({
      name: "title",
      images: [albumImageUrl],
      description: "description",
      type: "good",
      attributes: ["pdf_file"],
      metadata: {
        type: "music",
      },
    });
    //ADDING THE PRICE OF THE PRODUCT
    const amount_in_dollars = Number(price);
    const amount_in_cents = Math.floor(amount_in_dollars * 100);
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: amount_in_cents,
      currency: "usd",
    });
    //FORMAT THE BOOK TITLE AND SAVE THE BOOK 
    const lowercaseTitle = title.toLowerCase();
    var formattedTitle = lowercaseTitle.replace(/\s/g, ".");
    //autogenerate the mobile id
    var song = {
      title: title,
      artist: artist,
      price: price,
      streamUri: s3Song.Location,
      sampleUri: s3SongSample.Location,
      albumId: albumId,
      duration: duration,
      priceId: stripePrice.id,
      iosIAP: `song_${formattedTitle}`,
      priceIdMobile: `song_${formattedTitle}`,
    };

    var content = await MusicService.addMusic(song);
    sendPushNotification(
      "music",
      "New song added",
      "Check out the newly added song: " +
      req.body.title +
      " by " +
      req.body.artist
    );
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Music added succesfully",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// UPDATE Music
exports.updateMusic = async function (req, res, next) {
  try {
    var content = await MusicService.updateMusic(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Music succesfully updated",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// REMOVE Music
exports.removeMusic = async function (req, res, next) {
  try {
    var content = await MusicService.removeMusic(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Music Succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// GET BOOK BY ID
exports.getMusicById = async function (req, res, next) {
  try {
    var content = await MusicService.getMusicById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found Music",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
//SEARCH FOR Music BY TEXT OR DESCRIPTION
exports.getSearchResults = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    console.log(req.body.text);
    var data = await MusicService.getSearchResults(req.body.text, page, limit);

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved search results",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getLatestMusic = async function (req, res, next) {
  try {
    var content = await Music.findOne().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found Music",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// Find random 3
exports.getRandomMusic = async function (req, res) {
  try {
    var content = await MusicService.getRandom();
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Successfully retrieved 3 random music",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
// Get reviews by Song ID
exports.getReviewsBySongId = async function (req, res, next) {
  try {
    var content = await MusicService.getReviewsBySongId(req.params.id);
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

exports.findMusicByAlbum = async function (req, res, next) {
  try {
    var content = await MusicService.findMusicByAlbum(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Music succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.getMusicReviews = async function (req, res, next) {
  try {
    var content = await MusicService.getMusicReviews(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Music reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.removeMusicReview = async function (req, res) {
  try {
    await MusicService.removeMusicReview(req.params.id, req.body.reviewId).then(
      ReviewService.removeReview(req.body.reviewId)
    );
    return res.status(200).json("Successfully deleted");
  } catch (e) {
    throw Error(e);
  }
};
exports.updateMusicReview = async function (req, res) {
  try {
    await MusicService.updateMusicReview(req.params.id, req.body).then(
      ReviewService.updateReview(req.body._id, req.body)
    );
    return res.status(200).json("Successfully updated");
  } catch (e) {
    throw Error(e);
  }
};
