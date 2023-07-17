const mongoose = require("mongoose");
const { reviewSchema } = require("./Review");
const Schema = mongoose.Schema;

const bookSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },
    //Link to photo
    photo: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
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
    pdf_file: {
      type: String,
      required: true,
    },

    language: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

exports.Book = mongoose.model("Book", bookSchema);
exports.bookSchema = bookSchema;
