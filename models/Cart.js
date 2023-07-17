const mongoose = require("mongoose");
const { albumSchema } = require("./Album");
const { bookSchema } = require("./Book");
const { musicSchema } = require("./Music");
const { packSchema } = require("./Pack");
const { podcastSchema } = require("./Podcast");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    podcasts: [podcastSchema],
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        paperBook: {
          type: Boolean,
        },
      },
    ],
    music: [musicSchema],

    pack: packSchema,
  },
  {
    timestamps: true,
  }
);

exports.Cart = mongoose.model("Cart", cartSchema);
exports.cartchema = cartSchema;
