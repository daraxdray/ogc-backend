const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book.controller");
const { loginRequired } = require("../middleware/auth");

router.get("/all", loginRequired, BookController.getBooks);
router.post("/read-book", loginRequired, BookController.bookReader);
router.get("/yokens", BookController.gettokens);
router.post("/add", BookController.addBook);
router.get("/find/:id", loginRequired, BookController.getBookById);
router.put("/update/:id", BookController.updateBook);
router.delete("/remove/:id", BookController.removeBook);
router.get("/latest", BookController.getLatestBook);
router.get("/random", BookController.getRandomBooks);
router.get("/ogc", BookController.getOgcBook);
router.get("/ogc/latest", BookController.getLatestOgcBook);
router.post("/submission/request", BookController.sendBookSubRequest);
router.get("/getreviews/:id", BookController.getreviewsByBookId);
router.put("/reviews/remove/:id", BookController.removeBookReview);
router.put("/reviews/update/:id", BookController.updateBookReview);
router.get("/reviews/:id", BookController.getBookReviews);
router.get("/reviews-average/:id", BookController.getBookReviewsAverage);
router.post("/search", BookController.getSearchResults);

module.exports = router;
