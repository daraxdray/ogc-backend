const path = require("path");
const multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 25,
  },
});
module.exports = upload;
