const express = require("express");
const router = express.Router();
const EpisodeController = require("../controllers/episode.controller");
const { loginRequired } = require("../middleware/auth");

router.get("/all", EpisodeController.getEpisodes);
router.post("/add", EpisodeController.addEpisode);
router.get("/find/:id", EpisodeController.getEpisodeById);
router.put("/update/:id", EpisodeController.updateEpisode);
router.delete("/remove/:id", EpisodeController.removeEpisode);
router.get("/latest", EpisodeController.getLatestEpisode);
router.get("/podcast/:id", EpisodeController.getEpisodeByPodcastId);
router.get("/getreviews/:id", EpisodeController.getEpisodeReviews);
//router.put('/reviews/remove/:id', EpisodeController.removeEpisodeReview);
router.put("/reviews/update/:id", EpisodeController.updateEpisodeReview);
router.get("/reviews/:id", EpisodeController.getEpisodeReviews);

module.exports = router;
