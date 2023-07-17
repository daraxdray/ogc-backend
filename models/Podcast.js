const mongoose = require("mongoose");
const { episodeSchema } = require("./Episode");
const { reviewSchema } = require("./Review");
const Schema = mongoose.Schema;

const podcastSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceId: {
      type: String,
    },
    priceIdMobile: {
      type: String,
    },
    episodes: {
      type: [episodeSchema],
    },
    release_date: {
      type: Date,
      required: true,
    },
    cover: {
      type: String,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);
exports.Podcast = mongoose.model("Podcast", podcastSchema);
exports.podcastSchema = podcastSchema;
