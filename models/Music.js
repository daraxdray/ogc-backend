const mongoose = require("mongoose");
const { reviewSchema } = require("./Review");
const Schema = mongoose.Schema;

const musicSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: "00:00",
    },
    priceId: {
      type: String,
    },
    priceIdMobile: {
      type: String,
    },
    streamUri: {
      type: String,
      required: true,
    },
    sampleUri: {
      type: String,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Album",
    },
    reviews: [reviewSchema],
  },

  {
    timestamps: true,
  }
);

exports.Music = mongoose.model("Music", musicSchema);
exports.musicSchema = musicSchema;
