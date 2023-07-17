const express = require('express');
const router = express.Router();
const packContreller = require("../controllers/pack.controller");
const { loginRequired} = require('../middleware/auth');

router.get("/all", packContreller.getPacks);
router.post("/add",packContreller.addPack);
router.get("/find/:id",packContreller.getPackById);
router.put("/update/:id", packContreller.updatePack);
router.delete("/remove/:id", packContreller.removePack);
router.get('/latest',packContreller.getLatestPack);

module.exports = router;