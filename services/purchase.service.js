const { Purchase } = require("../models/Purchase");

exports.getPurchases = async function (query, page, limit) {
  try {
    var content = await Purchase.find(query);
    return content;
  } catch (e) {
    throw Error("Error while fetching books");
  }
};
