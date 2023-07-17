const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const socialUserSchema = Schema(
  {
    id: {
      type: String,
    },
    email: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    picture: {
      type: String,
    },
    provider: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

exports.SocialUser = mongoose.model("SocialUser", socialUserSchema);
exports.socialUserSchema = socialUserSchema;
