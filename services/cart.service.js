const { Album } = require("../models/Album");
const { Book } = require("../models/Book");
const { Cart } = require("../models/Cart");
const { Music } = require("../models/Music");
const { Pack } = require("../models/Pack");
const { Podcast } = require("../models/Podcast");
const User = require("../models/User");
const crypt = require("crypto-js");
var ObjectId = require("mongodb").ObjectId;

// GET ALL Carts
exports.getCarts = async function (query, page, limit) {
  try {
    var content = await Cart.find(query);
    return content;
  } catch (e) {
    throw Error("Error while fetching Carts");
  }
};

// GET CART BY ID
exports.getCartById = async function (id) {
  try {
    var content = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
        model: "Book",
      },
    });
    return content;
  } catch (e) {
    throw Error("Error while finding cart");
  }
};

exports.addCartOnSignup = async function (id) {
  try {
    var cart = await Cart.create({ userId: id });
    const user = await User.findById(id);
    user.cart = cart;
    await user.save();
    return cart;
  } catch (e) {
    console.log(e);
    throw Error("Error adding new Cart");
  }
};

//ADD CART
exports.addCart = async function (document) {
  try {
    var content = await Cart.create(document);
    return content;
  } catch (e) {
    console.log(e);
    throw Error("Error adding new Cart");
  }
};

// REMOVE Cart
exports.removeCart = async function (id) {
  try {
    var content = await Cart.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

//Update CART
exports.updateCart = async function (id, data) {
  try {
    var content = await Cart.findByIdAndUpdate(id, data);
    return content;
  } catch (e) {
    throw Error("Error while updating Cart");
  }
};

//Add Music to Cart
exports.addMusicToCart = async function (id, music_id) {
  try {
    var mus = await Music.findById(music_id);
    var cart = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
      },
    });
    var user = await User.findOne({ "cart._id": cart._id });
    cart.music.push(mus);
    cart.total = (cart.total + mus.price).toFixed(2);
    user.cart = cart;
    await cart.save();
    await user.save();
    return cart;
  } catch (e) {
    throw Error(e, "error while adding music to cart");
  }
};
//Add BOOK to Cart
exports.addBookToCart = async function (id, book_id, ebook) {
  try {
    console.log(ebook);
    var book = await Book.findById(book_id);
    var cart = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
      },
    });
    var user = await User.findOne({ "cart._id": cart._id });
    console.log(cart.total);
    console.log(book.price);
    cart.total = (cart.total + book.price).toFixed(2);
    console.log(cart.total);
    cart.books.push({ book: book, paperBook: ebook });

    user.cart = cart;
    await cart.save();
    await user.save();
    return cart;
  } catch (e) {
    throw Error(e);
  }
};
//Remove BOOK from Cart
exports.removeBookFromCart = async function (id, bookInCartId) {
  try {
    var cart = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
      },
    });
    if (cart.total > 0) {
      var foundIndex = cart.books.findIndex(
        (element) => element._id == bookInCartId
      );
      if (foundIndex != -1) {
        var book = await Book.findById(cart.books[foundIndex].book._id);
        var user = await User.findOne({ "cart._id": cart._id });
        cart.total = (cart.total - book.price).toFixed(2);
        //cart.books.remove({ inCartId, book, paperBack });
        cart.books.splice(foundIndex, 1);
        user.cart = cart;
        await cart.save();
        await user.save();
      }
      return cart;
    } else {
      throw Error();
    }
  } catch (e) {
    throw Error("error while removing book to cart");
  }
};
//Remove Music from Cart
exports.removeMusicToCart = async function (id, music_id) {
  try {
    var cart = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
      },
    });
    if (cart.total > 0) {
      var foundIndex = cart.music.findIndex(
        (element) => element._id == music_id
      );
      if (foundIndex !== -1) {
        cart.music.splice(foundIndex, 1);
      } else {
        throw Error();
      }
      var music = await Music.findById(music_id);
      var user = await User.findOne({ "cart._id": cart._id });

      cart.total = (cart.total - music.price).toFixed(2);
      //cart.music.remove(music);
      user.cart = cart;
      await cart.save();
      await user.save();
    }
    return cart;
  } catch (e) {
    throw Error("error while removing music to cart");
  }
};

//Add Podcast to Cart
exports.addPodcastToCart = async function (id, podcast_id) {
  try {
    var pod = await Podcast.findById(podcast_id);
    var cart = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
      },
    });
    var user = await User.findOne({ "cart._id": cart._id });
    cart.total = (cart.total + pod.price).toFixed(2);
    cart.podcasts.push(pod);
    user.cart = cart;
    await cart.save();
    await user.save();
    return cart;
  } catch (e) {
    throw Error("error while adding podcast to cart");
  }
};
exports.RemovePodcastToCart = async function (id, podcast_id) {
  try {
    var cart = await Cart.findById(id).populate({
      path: "books",
      populate: {
        path: "book",
      },
    });
    if (cart.total > 0) {
      var foundIndex = cart.podcasts.findIndex(
        (element) => element._id == podcast_id
      );
      if (foundIndex !== -1) {
        cart.podcasts.splice(foundIndex, 1);
      } else {
        throw Error();
      }
      var pod = await Podcast.findById(podcast_id);
      var user = await User.findOne({ "cart._id": cart._id });
      cart.total = (cart.total - pod.price).toFixed(2);
      //cart.podcasts.remove(pod);
      user.cart = cart;
      await cart.save();
      await user.save();
    }
    return cart;
  } catch (e) {
    throw Error("error while adding podcast to cart");
  }
};

//Add Podcast to Cart
exports.addPackToCart = async function (id, pack_id) {
  try {
    var pod = await Pack.findById(pack_id);
    var cart = await Cart.findById(id);
    var user = await User.findOne({ "cart._id": cart._id });
    cart.total = (cart.total + pod.price).toFixed(2);
    cart.packs.push(pod);
    user.cart = cart;
    await cart.save();
    await user.save();
    return cart;
  } catch (e) {
    throw Error("error while adding podcast to cart");
  }
};

//Empty cart once the purchase is made
exports.emptyCart = async function (id) {
  try {
    var iv = crypt.enc.Base64.parse(""); //giving empty initialization vector
    var key = crypt.SHA256(process.env.SESSION_SECRET); //hashing the key using SHA256

    var cart = await Cart.findById(id)
      .populate("podcasts.episodes")
      .populate("books")
      .populate("music");
    var user = await User.findOne({ "cart._id": cart._id });
    var np = [];
    var m = [];
    var b = [];
    if (cart.podcasts.length > 0) {
      np = cart.podcasts;
      np.map((p) => {
        p.episodes.map((e) => {
          const str = e.streamUri;
          const encrypted = crypt.AES.encrypt(JSON.stringify({ str }), key, {
            iv: iv,
            mode: crypt.mode.CBC,
            padding: crypt.pad.Pkcs7,
          }).toString();
          let encData = crypt.enc.Base64.stringify(
            crypt.enc.Utf8.parse(encrypted)
          );

          e.streamUri = encData;
          /*    const decrypted = crypt.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: crypt.mode.CBC,
            padding: crypt.pad.Pkcs7,
          }).toString(crypt.enc.Utf8); */
        });
      });
    }
    if (cart.music.length > 0) {
      m = cart.music;
      m.map((p) => {
        const str = p.streamUri;
        const encrypted = crypt.AES.encrypt(JSON.stringify({ str }), key, {
          iv: iv,
          mode: crypt.mode.CBC,
          padding: crypt.pad.Pkcs7,
        }).toString();
        let encData = crypt.enc.Base64.stringify(
          crypt.enc.Utf8.parse(encrypted)
        );
        p.streamUri = encData;
      });
    }
    if (cart.books.length > 0) {
      cart.books.map((p) => {
        const str = p.pdf_file;
        const encrypted = crypt.AES.encrypt(JSON.stringify({ str }), key, {
          iv: iv,
          mode: crypt.mode.CBC,
          padding: crypt.pad.Pkcs7,
        }).toString();
        let encData = crypt.enc.Base64.stringify(
          crypt.enc.Utf8.parse(encrypted)
        );

        p.book.pdf_file = encData;
        b.push(p.book);
      });
    }

    user.podcasts.push(...np);
    user.music.push(...m);
    user.library.push(...b);
    cart.podcasts = [];
    cart.music = [];
    cart.books = [];
    //cart.pack = [];
    cart.total = 0;
    user.cart = cart;
    await cart.save();
    await user.save();
    return cart;
  } catch (e) {
    throw Error(e);
  }
};
//Empty cart once the purchase is made (for mobile)
exports.emptyCartWithoutEncrpting = async function (id) {
  try {
    var cart = await Cart.findById(id);
    console.log("USER CART",cart);
    var user = await User.findOne({ "cart._id": cart._id });
    await user.podcasts.push(...cart.podcasts);
    await user.music.push(...cart.music);
    // cart.books.forEach(async (element) => {
    //   console.log(element);
    //   var book = await Book.findById(element.bookId);
    //   user.library.push(book);
    // });
   
    
    for (let element of cart.books) {
      console.log("WHY IS BOOK NOT ADDING",element);
      var book = await Book.find({"_id":ObjectId(element.book)});
      console.log("PDF FILE WHY NOT WORKKKK",book[0].pdf_file)
      await user.library.push(book[0]);
    }
    cart.podcasts = [];
    cart.music = [];
    cart.books = [];
    //cart.pack = [];
    cart.total = 0;
    user.cart = cart;
    await cart.save();
    await user.save();
   
    return cart;
  } catch (e) {
    throw Error(e);
  }
};

exports.purchaseItem = async function (id, priceId, type) {
  try {
    var cart = await Cart.findById(id);
    var user = await User.findOne({ "cart._id": cart._id });

    switch (type) {
      case "book":
        let book = await Book.findOne({ priceIdMobile: priceId });
        user.library.push(book);
        var foundIndex = cart.books.findIndex((element) =>
          element.book._id.equals(book._id)
        );
        if (foundIndex !== -1) {
          cart.books.splice(foundIndex, 1);
        } else {
          throw Error("foundIndex" + foundIndex);
        }
        cart.total = (cart.total - book.price).toFixed(2);
        break;
      case "song":
        let music = await Music.findOne({ priceIdMobile: priceId });
        user.music.push(music);
        console.log("cart", cart.music[0]._id);
        console.log("item", music._id);
        var foundIndex = cart.music.findIndex((element) =>
          element._id.equals(music._id)
        );
        if (foundIndex !== -1) {
          cart.music.splice(foundIndex, 1);
        } else {
          throw Error("foundIndex" + foundIndex);
        }
        cart.total = (cart.total - music.price).toFixed(2);
        break;
      case "podcast":
        let podcast = await Podcast.findOne({ priceIdMobile: priceId });
        user.podcasts.push(podcast);
        var foundIndex = cart.podcasts.findIndex((element) =>
          element._id.equals(podcast._id)
        );
        if (foundIndex !== -1) {
          cart.podcasts.splice(foundIndex, 1);
        } else {
          throw Error("foundIndex" + foundIndex);
        }
        cart.total = (cart.total - podcast.price).toFixed(2);
        break;
    }
    user.cart = cart;
    await cart.save();
    await user.save();
    return cart;
  } catch (e) {
    throw Error(e);
  }
};
