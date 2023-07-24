const express = require("express");
const router = express.Router();
const PurchaseController = require("../controllers/purchase.controller");

router.get("/all", PurchaseController.getPurchases);
router.post("/add", PurchaseController.addPurchase);
router.post("/intent", PurchaseController.createPaymentIntent);
router.post("/get-key", PurchaseController.getKey);
router.get("/find/:id", PurchaseController.getPurchaseById);
router.put("/update/:id", PurchaseController.updatePurchase);
router.delete("/remove/:id", PurchaseController.removePurchase);
module.exports = router;
