const mongoose = require("mongoose");
const { musicSchema } = require("./Music");
const { reviewSchema } = require("./Review");
const Schema = mongoose.Schema;

const albumSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    cover: {
      type: String,
    },
    songs: {
      type: [musicSchema],
    },
    reviews: [reviewSchema],
    priceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
exports.Album = mongoose.model("Album", albumSchema);
exports.albumSchema = albumSchema;
