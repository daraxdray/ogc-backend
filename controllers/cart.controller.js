const CartService = require("../services/cart.service");
var Cart = require("../models/Cart");
const User = require("../models/User");
const Stripe = require("stripe");
// GET ALL CARTS
exports.getCarts = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await CartService.getCarts({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//ADD A Cart
exports.addCart = async function (req, res, next) {
  try {
    var content = await CartService.addCart({
      total: req.body.total,
    });
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Cart added succesfully",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//create cart and assign to user on Sign up
exports.createCartOnSignup = async function (req, res, next) {
  try {
    const cart = await CartService.addCartOnSignup(req.body.userId);
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Cart succesfully created",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// UPDATE Cart
exports.updateCart = async function (req, res, next) {
  try {
    var content = await CartService.updateCart(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Cart succesfully updated",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// REMOVE Cart
exports.removeCart = async function (req, res, next) {
  try {
    var content = await CartService.removeCart(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Cart Succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// GET BOOK BY ID
exports.getCartById = async function (req, res, next) {
  try {
    var content = await CartService.getCartById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// Add Music to shopping CART
exports.addMusicToCart = async function (req, res) {
  try {
    var cart = await CartService.addMusicToCart(
      req.params.id,
      req.body.musicId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully added music to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// Add Book to shopping CART
exports.addBookToCart = async function (req, res) {
  try {
    console.log(req.body);
    var cart = await CartService.addBookToCart(
      req.params.id,
      req.body.bookId,
      req.body.paperBook
    );

    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully added book to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
exports.addAlbumToCart = async function (req, res) {
  try {
    var cart = await CartService.addAlbumToCart(
      req.params.id,
      req.body.albumId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully added album to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
exports.rmoveAlbumFromCart = async function (req, res) {
  try {
    var cart = await CartService.RemoveAlbumToCart(
      req.params.id,
      req.body.albumId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully removed album from Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// remove Book from shopping CART
exports.removeBookToCart = async function (req, res) {
  try {
    var cart = await CartService.removeBookFromCart(
      req.params.id,
      req.body.bookInCartId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully removed book to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// remove music from shopping CART
exports.removeMusicToCart = async function (req, res) {
  try {
    var cart = await CartService.removeMusicToCart(
      req.params.id,
      req.body.musicId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully removed music to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// Add Podcasr to shopping CART
exports.addPodcastToCart = async function (req, res) {
  try {
    var cart = await CartService.addPodcastToCart(
      req.params.id,
      req.body.podcastId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully added podcast  to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
exports.rmovePodcastToCart = async function (req, res) {
  try {
    var cart = await CartService.RemovePodcastToCart(
      req.params.id,
      req.body.podcastId
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully removed podcast  to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

// Add Podcasr to shopping CART
exports.addPackToCart = async function (req, res) {
  try {
    var cart = await CartService.addPackToCart(req.params.id, req.body.packId);
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "Succesfully added pack  to Cart",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

//empty the cart after the purchase is made
exports.emptyCart = async function (req, res) {
  try {
    var cart = await CartService.emptyCart(req.params.id);
    return res.redirect("https://ogcpublications.com/");
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
//empty the cart after the purchase is made
exports.emptyCartWithoutEncrypting = async function (req, res) {
  try {
    var cart = await CartService.emptyCartWithoutEncrpting(req.params.id);
    res.status(200);
    res.redirect('https://ogcpublications.com/');
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
//add 1 item to the profile
exports.purchaseItem = async function (req, res) {
  try {
    var cart = await CartService.purchaseItem(
      req.params.id,
      req.body.priceId,
      req.body.type
    );
    return res.status(200).json({
      status: 200,
      data: cart,
      message: "item purchased successfully",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
const stripe = Stripe(
  "pk_live_51LZrxEBKWbkdOPY6MZwmOdyTyHilnx3EaX8GXZM3gRzTUm2vzDUH4geLLUnfnG6aK3kDaPraFBA0fN6RgLsR74B600iVQIIj3n"
);
exports.paymentSheet = async function (req, res) {
  var elements = Stripe.elements;
  var customer = null;
  var user = await User.findById(req.user._id);
  // Use an existing Customer ID if this is a returning customer.
  if (user.customerId) {
    if (req.body.language) {
      customer = await stripe.customers.update(user.customerId, {
        preferred_locales: [req.body.language],
      });
    } else {
      customer = await stripe.customers.retrieve(user.customerId);
    }
  } else {
    customer = await stripe.customers.create({
      email: user.email,
      name: user.firstname + " " + user.lastname,
      address: { city: user.city, country: user.country },
      preferred_locales: [req.body.language],
    });
    user.customerId = customer.id;
    user.save();
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.total,
    currency: req.body.currency,
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_live_51LZrxEBKWbkdOPY6MZwmOdyTyHilnx3EaX8GXZM3gRzTUm2vzDUH4geLLUnfnG6aK3kDaPraFBA0fN6RgLsR74B600iVQIIj3n",
  });
};
