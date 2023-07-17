var mongoose = require("mongoose");

//posts schema
var NewsLetterJaniferchema = new mongoose.Schema(
  { 
    fullName:
    {
        type: String,
    }
  ,
    email: 
      {
        type: String,
      },
    

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NewsLetterJanifer", NewsLetterJaniferchema);