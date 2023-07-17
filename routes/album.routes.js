const express = require("express");
const router = express.Router();
const AlbumController = require("../controllers/album.controller");
const { loginRequired } = require("../middleware/auth");
const cors = require("cors");



router.get("/all", AlbumController.getAlbums);
router.post("/add", AlbumController.addAlbum);
router.get("/find/:id", AlbumController.getAlbumtById);
router.put("/update/:id", AlbumController.updateAlbum);
router.delete("/remove/:id", AlbumController.removeAlbum);
router.get("/latest", AlbumController.getLatestAlbum);
router.put("/reviews/remove/:id", AlbumController.removeAlbumReview);
router.put("/reviews/update/:id", AlbumController.updateAlbumReview);
router.get("/reviews/:id", AlbumController.getAlbumReviews);
router.get("/reviews-average/:id", AlbumController.getAlbumReviewsAverage);

module.exports = router;
