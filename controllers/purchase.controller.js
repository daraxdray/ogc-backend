const { Purchase } = require("../models/Purchase");
const User = require("../models/User");
const PurchaseService = require("../services/purchase.service");

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
