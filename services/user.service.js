const { Book } = require('../models/Book');
const { Music } = require('../models/Music');
const { Podcast } = require('../models/Podcast');
const User = require('../models/User');
var ObjectId = require('mongodb').ObjectId; 

exports.removeUser = async function (id) {
  try {
    var content = await User.findByIdAndDelete(id);
    return content;
  } catch (e) {
    throw Error(e);
  }
};

exports.editProfileInfo = async (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    console.log('========= User is', user);
    if (req.body.firstname) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.birthdate) {
      user.birth_date = req.body.birth_date;
    }
    if (req.body.gender) {
      user.gender = req.body.gender;
    }
    if (req.body.country) {
      user.country = req.body.country;
    }
    if (req.body.city) {
      user.city = req.body.city;
    }
    user.save((err, updatedUser) => {
      if (err) {
        console.log('User not updating', err);
        return res.status(400).json({
          error: 'User update failed',
        });
      }
      res.json(updatedUser);
    });
  });
};

exports.updateController = (req, res) => {
  var upload = multer({
    storage: fileUpload.files.storage(),
    allowedFile: fileUpload.files.allowedFile,
  }).single('photo');

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    // console.log(user);

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send(err);
      } else if (err) {
        res.send(err);
      } else {
        if (req.body.newpassword) {
          //console.log(req.body.password);
          if (req.body.newpassword.length < 6) {
            return res.status(400).json({
              error: 'Password should be min 6 characters long',
            });
          } else {
            if (!user.authenticate(req.body.oldpassword)) {
              console.log('WRONG PASSWORD');
              return res.status(400).json({
                errors: 'Old password is incorrect',
              });
            } else {
              console.log('OLD PASSWORD IS', req.body.oldpassword);

              user.password = req.body.newpassword;
            }
          }
        }
        if (req.file) {
          user.photo = req.file.filename;
        }
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        if (req.body.email) {
          user.email = req.body.email;
        }
        if (req.body.birth_date) {
          user.birth_date = req.body.birth_date;
        }
        if (req.body.gender) {
          user.gender = req.body.gender;
        }
        if (req.body.country) {
          user.country = req.body.country;
        }
        if (req.body.countryOfOrigin) {
          user.countryOfOrigin = req.body.countryOfOrigin;
        }
        if (req.body.city) {
          user.city = req.body.city;
        }
        if (req.body.church) {
          user.city = req.body.church;
        }

        user.save((err, updatedUser) => {
          if (err) {
            console.log('USER UPDATE ERROR', err);
            return res.status(400).json({
              error: 'User update failed',
            });
          }
          updatedUser.hashed_password = undefined;
          updatedUser.salt = undefined;
          res.json(updatedUser);
        });
      }
    });
  });
};

exports.addPodcast = async (userData, id) => {
  try {
    var podc = await Podcast.findById(id);
    var user = await User.findById(userData._id);
    user.podcasts.push(podc);
    await user.save();
    return user;
  } catch (err) {
    throw Error('Error ==> ', err);
  }
};
exports.addBook = async (userData, id) => {
  try {
    var book = await Book.findById(id);
    var user = await User.findById(userData._id);
    user.library.push(book);
    await user.save();
    return user;
  } catch (err) {
    throw Error('Error ==> ', err);
  }
};

// add music for user after purchase
exports.addMusic = async (userData, id) => {
  try {
    var mus = await Music.findById(id);
    var user = await User.findById(userData._id);
    console.log('music to be added', mus);
    user.music.push(mus);
    await user.save();
    console.log('user after save', user);
    return user;
  } catch (err) {
    throw Error('Error ==> ', err);
  }
};

exports.getUserById = async function (id) {
  try {
    const user = await User.findById(id).populate({
      path: 'cart',
      populate: {
        path: 'books',
        populate: {
          path: 'book',
        },
      },
    });
    return user;
  } catch (e) {
    console.log(e);
  }
};

exports.getFullname = async function (id) {
  try {
    const user = await User.findById(id);
    return user.firstname + ' ' + user.lastname;
  } catch (e) {
    console.log(e);
  }
};
exports.getUserItemsByUserId = async function (id) {
  try {
    const user = await User.findById(id);
    const userLibrary = [];
    const userMusic = [];
    const userPodcasts = [];
    for (let element of user.library) {
      var book = await Book.findById(element._id);
      userLibrary.push(book);
    }
    for (let element of user.music) {
      var music = await Music.findById(element._id);
      userMusic.push(music);
    }

    for (let element of user.podcasts) {
      var podcast = await Podcast.findById(element._id);
      userPodcasts.push(podcast);
    }
    user.library = userLibrary;
    user.music = userMusic;
    user.podcasts = userPodcasts;
    await user.save();
    return user;
    //return { library: userLibrary, music: userMusic, podcasts: userPodcasts };
  } catch (e) {
    console.log(e);
  }
};
exports.getEmailByFbId = async function (id) {
  try {
    const user = await User.findOne({ facebookId: id });
    return user.email;
    //return { library: userLibrary, music: userMusic, podcasts: userPodcasts };
  } catch (e) {
    console.log(e);
  }
};
