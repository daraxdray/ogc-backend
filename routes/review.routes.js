const express = require("express");
const router = express.Router();
var ReviewController = require('../controllers/review.controller');
const { loginRequired} = require('../middleware/auth');




router.get("/", ReviewController.getReviews);
router.post("/add",loginRequired, ReviewController.addReview);
router.put("/update/:id", ReviewController.updateReview);
router.delete("/remove/:id", ReviewController.removeReview);
router.get("/search/:id", ReviewController.getReviewByid);
router.get("/book/:id",ReviewController.getReviewsByBookId);
router.get("/song/:id",ReviewController.getReviewsBySongId);


module.exports = router
