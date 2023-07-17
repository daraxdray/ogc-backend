router = require("express").Router();
newsLetterController = require("../controllers/NewsLetterController");

router.post("/subscribe", newsLetterController.subsrcibe);
router.post("/send", newsLetterController.sendMails);
module.exports = router;
