const { Book } = require("../models/Book");
const Token = require("../models/ResetToken");
const { getUserById } = require("./user.service");
// GET ALL BOOKS
exports.getBooks = async function (query, page, limit) {
  try {
    var content = await Book.find(query).select(["-pdf_file"]);
    return content;
  } catch (e) {
    throw Error("Error while fetching books");
  }
};

exports.getTokens = async function (query, page, limit) {
  try {
    var content = await Token.find(query);
    return content;
  } catch (e) {
    throw Error("Error while fetching books");
  }
};

// GET BOOK BY ID
exports.getBookById = async function (id) {
  try {
    var content = await Book.findById(id);
    return content;
  } catch (e) {
    throw Error("Error while finding book");
  }
};

// REMOVE BOOK
exports.removeBook = async function (id) {
  try {
    var content = await Book.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//SEARCH FOR BOOK BY TITLE OR DESCRIPTION
exports.getSearchResults = async function (text, page, limit) {
  try {
    Books.createIndexes({
      title: text,
      description: text,
      author: text,
    }).select(["-pdf_file"]);
    const query = { $text: { $search: text } };
    var content = await Book.find(query);
    return content;
  } catch (e) {
    throw Error(e + "Error while fetching search results");
  }
};

//Get Random 3 BOOKS
exports.getRandom = async function () {
  try {
    const content = await Book.find().select(["-pdf_file"]);
    const l = content.length - 2;
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    r = random(0, l);
    const book = await Book.find().skip(r).limit(3);
    return book;
  } catch (e) {
    throw Error(e);
  }
};
//Get 1 Random  BOOK
exports.getRandomBook = async function () {
  try {
    const content = await Book.find().select(["-pdf_file"]);
    const l = content.length - 1;
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    r = random(0, l);
    const book = await Book.find().skip(r).limit(1);
    return book;
  } catch (e) {
    throw Error(e);
  }
};

// Get Onorio Cutane Books
exports.getOgcBook = async function () {
  try {
    const content = await Book.find({ author: "Onorio Cutane" }).select([
      "-pdf_file",
    ]);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

exports.getreviewsByBookId = async function (id) {
  try {
    var result = [];
    var final_result = [];
    var content = await Book.findById(id);
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
exports.getBookReviews = async function (id) {
  try {
    var content = await Book.findById(id);
    return content.reviews;
  } catch (e) {
    throw Error(e);
  }
};
exports.removeBookReview = async function (id, reviewId) {
  try {
    await Book.updateOne(
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

exports.updateBookReview = async function (id, review) {
  try {
    await Book.findOneAndUpdate(
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

exports.getBookReviewsAverage = async function (id) {
  try {
    var book = await Book.findById(id);
    var reviewsSum = 0;
    var reviewsNb = 0;
    for (let review of book.reviews) {
      if (review.isApproved) {
        reviewsSum += review.rating;
        reviewsNb++;
      }
    }
    return Math.round(reviewsSum / reviewsNb);
  } catch (e) {
    throw Error(e);
  }
};
