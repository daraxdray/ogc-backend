var mongoose = require("mongoose");

//posts schema
var NewsLetterchema = new mongoose.Schema(
  {
    emails: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NewsLetter", NewsLetterchema);
