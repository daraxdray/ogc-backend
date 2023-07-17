const mongoose = require('mongoose');
const { reviewSchema } = require('./Review');
const Schema = mongoose.Schema;

const episodeSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '00:00',
    },
    streamUri: {
      type: String,
      required: true,
    },
    sampleUri: {
      type: String,
    },
    podcastId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Podcast',
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);
exports.Episode = mongoose.model('Episode', episodeSchema);
exports.episodeSchema = episodeSchema;
