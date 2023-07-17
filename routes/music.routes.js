const express = require('express');
const router = express.Router();
const MusicController = require("../controllers/music.controller");
const { loginRequired} = require('../middleware/auth');


router.get("/all", MusicController.getMusic);
router.post("/add",MusicController.addSMusic);
router.get("/find/:id",MusicController.getMusicById);
router.put("/update/:id", MusicController.updateMusic);
router.delete("/remove/:id", MusicController.removeMusic);
router.get('/latest',MusicController.getLatestMusic);
router.get('/random', MusicController.getRandomMusic);
router.get('/getreviews/:id', MusicController.getReviewsBySongId);
router.get('/reviews/:id',MusicController.getMusicReviews);
router.get('/album/:id',MusicController.findMusicByAlbum);
router.put('/reviews/remove/:id', MusicController.removeMusicReview);
router.put("/reviews/update/:id", MusicController.updateMusicReview);


module.exports = router;