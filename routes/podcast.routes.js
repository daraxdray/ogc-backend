const express = require("express");
const router = express.Router();
const PodcastController = require("../controllers/podcast.controller");
const { loginRequired } = require("../middleware/auth");

router.get("/all", PodcastController.getPodcasts);
router.post("/add", PodcastController.addPodcast);
router.get("/find/:id", PodcastController.getPodcastById);
router.put("/update/:id", PodcastController.updatePodcast);
router.delete("/remove/:id", PodcastController.removePodcast);
router.get("/latest", PodcastController.getLatestPodcast);
router.get("/reviews/:id", PodcastController.getPodcastReviews);
router.put("/reviews/remove/:id", PodcastController.removePodcastReview);
router.put("/reviews/update/:id", PodcastController.updatePodcastReview);
router.get("/reviews-average/:id", PodcastController.getPodcastReviewsAverage);
module.exports = router;
