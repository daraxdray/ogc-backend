const BookService = require("../services/book.service");
var { Book } = require("../models/Book");
var fileUpload = require("../config/multer-config");
const multer = require("multer");
const { loginRequired } = require("../middleware/auth");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const ReviewService = require("../services/review.service");

const axios = require("axios");
const { sendPushNotification } = require("../utils/sendPushNotification");

exports.bookReader = async (req, res, next) => {
  try {
    const {awsUrl} = req.body;

    const response = await axios.get(awsUrl, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error(`Error fetching PDF from AWS S3: ${response.status} ${response.statusText}`);
    }

    const pdfBuffer = Buffer.from(response.data, 'binary');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');

    res.status(200).send(pdfBuffer);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
}
// GET ALL BOOKS
exports.getBooks = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await BookService.getBooks({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved books",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.gettokens = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await BookService.getTokens({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved books",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//ADD A BOOK : USING MULTER UPLOAD TO UPLOAD BOOK COVER AND PDF VERSION
exports.addBook = (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    date: req.body.date,
    photo: req.body.photo,
    description: req.body.description,
    price: req.body.price,
    language: req.body.language,
    priceId: req.body.priceId,
    pdf_file: req.body.pdf_file,
  });
  if (req.body.priceIdMobile) {
    book.priceIdMobile = req.body.priceId;
  }
  book.save((err, book) => {
    if (err) {
      //console.log("-------------------",req.files)
      console.log(err);
      console.log("Save error", errorHandler(err));
      return res.status(401).json({
        errors: errorHandler(err),
      });
    } else {
      sendPushNotification(
        "book",
        "New book added",
        "Check out the newly added book: " +
          req.body.title +
          " by " +
          req.body.author
      );
      return res.json({
        success: true,
        data: book,
        message: "Book added successfully",
      });
    }
  });
};

// UPDATE BOOK
exports.updateBook = (req, res) => {
  var u = multer({
    storage: fileUpload.files.storage(),
    allowedFile: fileUpload.files.allowedFile,
  });
  var uploadMultiple = u.fields([
    { name: "photo", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
  ]);

  Book.findOne({ _id: req.params.id }, (err, book) => {
    if (err || !book) {
      return res.status(400).json({
        error: "Book not found",
      });
    }
    uploadMultiple(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send(err);
      } else if (err) {
        res.send(err);
      } else {
        if (req.body.title) {
          book.title = req.body.title;
        }
        if (req.body.description) {
          book.description = req.body.description;
        }
        if (req.body.author) {
          book.author = req.body.author;
        }
        if (req.body.price) {
          book.price = req.body.price;
        }
        if (req.body.language) {
          book.language = req.body.language;
        }
        if (req.photo) {
          book.photo = req.files.photo[0].originalnamex;
        }
        if (req.pdf_file) {
          book.pdf_file = req.files.pdf_file[0].originalname;
        }
        if (req.body.priceIdMobile) {
          book.priceIdMobile = req.body.priceId;
        }
        book.save((err, updatedBook) => {
          if (err) {
            console.log("BOOK UPDATE ERROR", err);
            return res.status(400).json({
              error: "Book update failed",
            });
          }

          res.json(updatedBook);
        });
      }
    });
  });
};

// REMOVE BOOK
exports.removeBook = async function (req, res, next) {
  try {
    var content = await BookService.removeBook(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Book Succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// GET BOOK BY ID
exports.getBookById = async function (req, res, next) {
  try {
    var content = await BookService.getBookById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found book",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
//SEARCH FOR BOOK BY TEXT OR DESCRIPTION
exports.getSearchResults = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    console.log(req.body.text);
    var data = await BookService.getSearchResults(req.body.text, page, limit);

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

// Get latest ADD Book
exports.getLatestBook = async function (req, res, next) {
  try {
    var content = await Book.findOne().sort({ date: -1 }).select(["-pdf_file"]);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found book",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
exports.getreviewsByBookId = async function (req, res, next) {
  try {
    var content = await BookService.getreviewsByBookId(req.params.id);
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
// Find random 3
exports.getRandomBooks = async function (req, res) {
  try {
    var content = await BookService.getRandom();
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Successfully retrieved 3 random books",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// Find all Onorio Cutane's Books
exports.getOgcBook = async (req, res) => {
  try {
    var books = await BookService.getOgcBook();
    return res.status(200).json({
      status: 200,
      data: books,
      message: "Successfully retrieved Onorio Cutane Books",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

// Get latest Onorio Cutane's Book
exports.getLatestOgcBook = async function (req, res, next) {
  try {
    var content = await Book.findOne({ author: "Onorio Cutane" })
      .sort({
        date: -1,
      })
      .select(["-pdf_file"]);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found book",
    });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

exports.sendBookSubRequest = async function (req, res, next) {
  try {
    sendEmail.sendBookSubmission(req.body);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
exports.getBookReviews = async function (req, res, next) {
  try {
    var content = await BookService.getBookReviews(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "book reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
exports.removeBookReview = async function (req, res) {
  try {
    await BookService.removeBookReview(req.params.id, req.body.reviewId).then(
      ReviewService.removeReview(req.body.reviewId)
    );
    return res.status(200).json("Successfully deleted");
  } catch (e) {
    throw Error(e);
  }
};

exports.updateBookReview = async function (req, res) {
  try {
    await BookService.updateBookReview(req.params.id, req.body).then(
      ReviewService.updateReview(req.body._id, req.body)
    );
    return res.status(200).json("Successfully updated");
  } catch (e) {
    throw Error(e);
  }
};
exports.getBookReviewsAverage = async function (req, res, next) {
  try {
    var content = await BookService.getBookReviewsAverage(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "book reviews succesfully found",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
