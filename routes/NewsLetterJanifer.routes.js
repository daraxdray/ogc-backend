router = require("express").Router();
newsLetterJaniferController = require("../controllers/NewsLetterJaniferController");

router.post("/subscribe", newsLetterJaniferController.subscribe);

module.exports = router;