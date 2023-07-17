const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller");
const { loginRequired } = require("../middleware/auth");

router.get("/all", CartController.getCarts);
router.post("/add", CartController.addCart);
router.get("/find/:id", CartController.getCartById);
router.put("/update/:id", CartController.updateCart);
router.delete("/remove/:id", CartController.removeCart);
router.put("/add-music/:id", CartController.addMusicToCart);
router.put("/add-book/:id", CartController.addBookToCart);
router.put("/remove-book/:id", CartController.removeBookToCart);
router.put("/remove-music/:id", CartController.removeMusicToCart);
router.put("/remove-podcast/:id", CartController.rmovePodcastToCart);

router.put("/add-podcast/:id", CartController.addPodcastToCart);

router.put("/add-pack/:id", CartController.addPodcastToCart);
router.get("/empty-cart/:id", CartController.emptyCart);
router.get("/empty-cart-mobile/:id", CartController.emptyCartWithoutEncrypting);
router.post("/purchase-item/:id", CartController.purchaseItem);
router.post("/signup", CartController.createCartOnSignup);
router.post("/payment-sheet/", CartController.paymentSheet);
module.exports = router;
