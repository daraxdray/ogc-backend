const mongoose = require("mongoose");
const { reviewSchema } = require("./Review");
const UserSchema = require("./User");
const Schema = mongoose.Schema;

const purchaseSchema = Schema(
  {
    productIds: {
      type: [String],
      required: true,
    },
    mobile: {
      type: Boolean,
      default: true,
    },
    total: {
      type: String,
      default: 0,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

exports.Purchase = mongoose.model("Purchase", purchaseSchema);
exports.purchaseSchema = purchaseSchema;
