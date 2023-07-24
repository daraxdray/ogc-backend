
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const { Purchase } = require("../models/Purchase");
const User = require("../models/User");
const PurchaseService = require("../services/purchase.service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
exports.getKey = (req, res) => {
  try {
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (e) {
    console.log(e);
  }
},
exports.getPurchases = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var data = await PurchaseService.getPurchases({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Succesfully retrieved purchases",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

exports.addPurchase = async (req, res) => {
  const purchase = new Purchase({
    productIds: req.body.productIds,
    mobile: req.body.mobile,
    total: req.body.total,
    userId: req.body.userId,
  });
  purchase.save((err) => {
    if (err) {
      console.log(err);
      console.log("Save error", errorHandler(err));
      return res.status(401).json({
        errors: errorHandler(err),
      });
    } else {
      return res.json({
        success: true,
        data: purchase,
        message: "Purchase added successfully",
      });
    }
  });
};

// UPDATE Purchase
exports.updatePurchase = (req, res) => {
  Purchase.findOne({ _id: req.params.id }, (err, purchase) => {
    if (err || !purchase) {
      return res.status(400).json({
        error: "Purchase not found",
      });
    }
    if (req.body.productIds) {
      purchase.productIds = req.body.productIds;
    }

    if (req.body.mobile) {
      purchase.mobile = req.body.mobile;
    }
    if (req.body.total) {
      purchase.total = req.body.total;
    }
    if (req.body.userId) {
      purchase.userId = req.body.userId;
    }
    purchase.save((err, updatedPurchase) => {
      if (err) {
        console.log("Purchase update failed", err);
        return res.status(400).json({
          error: "Purchase update failed",
        });
      }
      res.json(updatedPurchase);
    });
  });
};

// REMOVE Purchase
exports.removePurchase = async function (req, res, next) {
  try {
    var content = await Purchase.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Purchase Succesfully deleted",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// GET Purchase BY ID
exports.getPurchaseById = async function (req, res, next) {
  try {
    var content = await Purchase.findById(req.params.id);
    return res.status(200).json({
      status: 200,
      data: content,
      message: "Succesfully found purchase",
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};
// GET PAYMENT INTENT
exports.createPaymentIntent =async  (req, res) => {
  try {
    var val = Number(req.body.amount);
    const roundedValue = parseFloat(val) * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: Math.round(roundedValue),
      description: "OGC Publications",
      metadata: {
        cart: JSON.stringify(req.body.cart),
        fullname: req.body.fullname,
        email: req.body.email,
        state: req.body.state,
        zipcode: req.body.zipcode
      },
      receipt_email: req.body.email,
      payment_method_types: ["card"],
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      success:true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
}