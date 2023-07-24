const User = require("../models/User");
const Token = require("../models/ResetToken");
const bcrypt = require("bcrypt");
const multer = require("multer");
var fileUpload = require("../config/multer-config");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { Cart } = require("../models/Cart");

exports.loginRequired = (req, res, next, err) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).send(res.send(err), "User must be logged in");
  }
};

// Sign in method
exports.signIn = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists && ((userExists.role === "admin") || (userExists.role === "super admin")  || (userExists.role === "user"))) {
      const comparePwd =  bcrypt.compareSync(
        req.body.password,
        userExists.password
      );
      if (comparePwd) {
        sess = req.session;
        sess.email = req.body.email;
        return res.status(200).json({success:true,sess, user:userExists});
      } else {
        return res.status(200).send({success:false, message:"Wrong credentials provided!"});
      }
    }
    //if user doesnt exist
    else {
      return res.status(200).send({success:false, message:"Wrong credentials provided!"})
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong with the user");
  }
};

//sign up method
exports.signUp = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(401).send("User already Exists");
    }
    // continue to sign up if user doesnt exist
    else {
      var u = multer({
        storage: fileUpload.files.storage(),
        allowedFile: fileUpload.files.allowedFile,
      }).single("photo");
      u(req, res, function (err) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors);
          const firstError = errors.array().map((error) => error.msg)[0];
          return res.status(422).send(firstError);
        }
        const newCart = new Cart({});
        var newUser;
        if (req.body.photo != "") {
          newUser = new User({
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            country: req.body.country,
            city: req.body.city,
            photo: req.body.photo,
            gender: req.body.gender,
            role: req.body.role,
            cart: newCart,
          });
        } else {
          newUser = new User({
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            country: req.body.country,
            city: req.body.city,
            gender: req.body.gender,
            role: req.body.role,
            cart: newCart,
          });
        }

        if (req.file) {
          console.log(req.file);
          newUser.photo = req.file.filename;
        }
        if (req.body.facebookId) {
          newUser.facebookId = req.body.facebookId;
        }
        //saving the user
        newUser.save((err, user) => {
          console.log(user);
          if (err) {
            console.log(err);
            return res.status(400).send("error saving the user");
          } else {
            /* return res.json({
              success: true,
              data:user,
              message: 'Signup successful'
            }); */
            newCart.save();
            res.status(200).send(user);
          }
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Sebd token to user's EMAIL when he forgets his password
exports.sendToken = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User with that email doesnt exist");
    }
    const newpwd = Math.random().toString(36).slice(-8);
    user.password = newpwd;
    await user.save();
    console.log("new pwd======> ", newpwd);
    const sent = await sendEmail.sendResetEmail(user.email, newpwd);
    console.log("sent");
    if (sent) {
      res.status(200).json("mail sent");
    } else {
      res.status(400).json("smthing went wrong");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// Send token to user email when they forget their password
exports.sendTokenForMobile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User with that email doesnt exist");
    }
    const token = await Token.findOne({ userId: user._id });
    if (token) {
      return res.status(401).send("Token already sent");
    }
    const newToken = new Token({
      userId: user._id,
      token: Math.floor(100000 + Math.random() * 900000),
    });
    newToken.save();
    console.log("new token======> ", newToken);
    sendEmail.sendResetEmailForMobile(user.email, newToken.token);
    console.log("sent");
    return res.json({
      success: true,
      data: user._id,
      message: "verif sent",
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.validateToken = async (req, res) => {
  const token = await Token.findOne({ token: req.body.token });
  if (!token) {
    return res.status(400).send("Token doesnt exist or expired");
  }
  const user = await User.findOne({ id: token.userId });
  if (!user) {
    return res.status(404).send("User with that email doesnt exist");
  }
  return res.json({
    success: true,
    data: token.userId,
    message: "valide token",
  });
};
//resetPWd
const oldReset = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("user not found");
    }
    const newpwd = Math.random().toString(36).slice(-8);
    user.password = newpwd;
    await user.save();
    console.log("new pwd======> ", newpwd);
    const sent = await sendEmail.sendResetEmailOld(user.email, newpwd);
    console.log("sent");
    if (sent) {
      return 1;
    } else {
      console.log("still waiting");
    }
  } catch (error) {
    console.log(error);
  }
};

//reset old users password and sen them mail
exports.oldsend = async (req, res) => {
  try {
    var i = 0;
    /*  const emails=["21empressariaelisa2@gmail.com",
    "adeliaalexandren@gmail.com",
    "adilsongaliano26@gmail.com",
    "advilanculos@gmail.com",
    "alagejoana@gmail.com",
    "aldacatt@gmail.com",
    "alfredomunisse@gmail.com",
    "ameni@korsgy.com",
    "amissecatija@gmail.com",
    "anailodia@gmail.com",
    "andricozaqueio@gmail.com",
    "antoniomanjatejunior@gmail.com",
    "auroorcedio@gmail.com",
    "azaqueio-21@live.com",
    "catijaalmeidaalmeida@gmail.com",
    "celestejoaonhanombe@gmail.com",
    "celso842817055@gmail.com",
    "celulazimpeto17@gmail.com",
    "chaukeeddiegerson@gmail.com",
    "chissanoo031@gmail.com",
    "clitonalberto@gmail.com",
    "coltinamatos@gmail.com",
    "costaalegregerciley2@gmail.com",
    "custodiomaela@gmail.com",
    "davidturner658378@gmail.com",
    "denise.bruna@icloud.com",
    "didisaide@yahoo.com.br",
    "dinercimuangas@gmail.com",
    "dircevicente@yahoo.com",
    "dulcesilva4@hotmail.com",
    "e_contreiras@hotmail.com",
    "ednopedrorabeca@gmail.com",
    "eduardomassolari@gmail.com",
    "efraimedavidchilaule@gmail.com",
    "eldomanjate@gmail.com",
    "eliisrob007@gmail.com",
    "elisasambo2021@gmail.com",
    "elizabethrobertomatavel@gmail.com",
    "erciliasigeia@gmail.com",
    "especem@gmail.cm",
    "evilove80@hotmail.com",
    "falcaodaterra@hotmail.com",
    "felizardonovela@gmail.com",
    "fernandoboavida00@gmail.com",
    "fortunesiniquinha@gmail.com",
    "fungulaneselda5@gmail.com",
    "gbnhantumbo@gmail.com",
    "gilbertomabjaia@gmail.com",
    "gildauamba@yahoo.com.br",
    "guiambulalaura@email.com",
    "heldinocaandre2022@gmail.com",
    "heldinocaandre8@gmail.com",
    "HermenyRafaelEduardo@gmail.com",
    "hiba@korsgy.com",
    "ivonemalendza06@gmail.com",
    "jasifofa@gmail.com",
    "joselinotavareslopes@gmail.com",
    "josemariarodolfopai@gmail.com",
    "jumba2010@gmail.com",
    "katiabila17@gmail.com",
    "leaalbertina@gmail.COM",
    "loicelipoche@gmail.com",
    "lubavalentina@gmail.com",
    "manguenguerodina17@hotmail.com",
    "manguenguerodina17@gmail.com",
    "martinhatimane22@gmail.com",
    "maydaabiliomahulane@gmail.com",
    "mayracristinamabote46@gmail.com",
    "merpachisso@gmail.com",
    "milagrosacome@gmail.com",
    "mteixeira7774@gmail.com",
    "narcio.natingue@gmail.com",
    "nelviaolga@gmail.com",
    "nnuriagarcia55@gmail.com",
    "oldemirojose@gmail.com",
    "oliviochongo24@gmail.com",
    "olnuvunga@gmail.com",
    "pleiladeizy@gmail.com",
    "princecarlos1524@gmail.com",
    "rafaellbata@gmail.com",
    "ripsime.jangiryan@gmail.com",
    "ruth.rds54@gmail.com",
    "saindaugustos2088@gmail.com",
    "selciop@gmail.com",
    "serafimmabunda@gmail.com",
    "sheilabenzabe@gmail.com",
    "Sheimadominoje@gmail.com",
    "shelciadossantos53@gmail.com",
    "sidchagua01@gmail.com",
    "sidneyrestart@gmail.com",
    "sonia.buque@hotmail.com",
    "support@korsgy.com",
    "taniacastarinagabriel@gmail.com",] */
    const emails = ["samer.achour@esprit.tn", "zaineb.bencheikh@korsgy.com"];
    await emails.forEach((e) => {
      i += oldReset(e);
    });

    res.status(200).json("all sent ....");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
