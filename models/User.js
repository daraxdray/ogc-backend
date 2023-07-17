const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { podcastSchema } = require("./Podcast");
const { bookSchema } = require("./Book");
const { musicSchema } = require("./Music");
const { reviewSchema } = require("./Review");
const { cartchema } = require("./Cart");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "https://storage.googleapis.com/ogc_music/default-picture.png",
    },
    cover_photo: {
      type: String,
    },
    country: {
      type: String,
      default: "default",
    },
    birthdate: {
      type: Date,
      //required: true,
      default: "1910-01-01",
      min: "1910-01-01",
      max: "2022-01-01",
    },
    city: {
      type: String,
      //required: true,
      default: "default",
    },
    gender: {
      type: String,
      //required: true,
      default: "default",
    },
    role: {
      type: String,
      enum: ["user", "admin", "super admin"],
      default: "user",
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    cart: cartchema,
    podcasts: [podcastSchema],
    library: [bookSchema],
    music: [musicSchema],
    deviceToken: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    customerId: {
      type: String,
    },
  },
  { timestamps: true }
);

//Hash the password before saving user
UserSchema.pre("save", function (next) {
  const user = this;

  // Check if password is modified or new to hash it
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
