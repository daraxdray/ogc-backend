const mongoose = require("mongoose");
const { albumSchema } = require("./Album");
const { bookSchema } = require("./Book");
const { musicSchema } = require("./Music");
const { podcastSchema } = require("./Podcast");
const Schema = mongoose.Schema;

const packSchema = Schema({
  title: {
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
  picture: {
      type: String
  },
  music: musicSchema,
  album: albumSchema,
  book: bookSchema,
  podcast: podcastSchema,
},

{
    timestamps: true,
});

exports.Pack = mongoose.model("Pack", packSchema);
exports.packSchema = packSchema;
