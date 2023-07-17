const { Pack } = require("../models/Pack");
const PackService = require("../services/pack.service");
const multer = require("multer");
var fileUpload = require("../config/multer-config");
const { validationResult } = require("express-validator");



// GET ALL Packs 
exports.getPacks = async function (req, res, next) {

    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : 10;
    try {
      var data = await PackService.getPacks({}, page, limit);
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Succesfully retrieved Packs",
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message,
      });
    }
  };
  
  //ADD A Pack
  exports.addPack = async (req, res, next) => {
    try {
      var u = multer({
        storage: fileUpload.files.storage(),
        allowedFile: fileUpload.files.allowedFile,
      }).single('photo');
      u(req, res, function (err) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors);
          const firstError = errors.array().map((error) => error.msg)[0];
          return res.status(422).send(firstError)
        }
        const newPack = new Pack({
          title: req.body.title,
          priceId: req.body.priceId,
          price: req.body.price,
          book: req.body.book,
          music: req.body.music,
          podcast: req.body.podcast,
        });
        if (req.file) {
          console.log(req.file);
          newPack.picture = req.file.filename;
        }
        //saving the pack
        newPack.save((err, pack) => {
          console.log(pack);
          if (err) {
            console.log(err);
            return res.status(401).send(err, 'error creating the pack');
          }
          else {
  
            res.status(200).send(pack);
          }
        })
  
      });
  
  
    }
    catch (error) {
      res.status(500).send(error,'internal server error')
    }
  }
  
  
  // Update a Pack
  exports.updatePack = async function (req, res, next) {
    try {
      var content = await PackService.updatePack(req.params.id, req.body);
      return res.status(200).json({
        status: 200,
        data: content,
        message: "Pack succesfully updated",
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message,
      });
    }
  };
  
  exports.removePack = async function (req, res, next) {
    try {
      var content = await PackService.removePack(req.params.id);
      return res.status(200).json({
        status: 200,
        data: content,
        message: "Pack succesfully deleted",
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message,
      });
    }
  };
  
  exports.getPackById = async function (req, res, next) {
    try {
      var content = await PackService.getPackById(req.params.id);
      return res.status(200).json({
        status: 200,
        data: content,
        message: "Pack succesfully found",
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message,
      });
    }
  };
  
  exports.getLatestPack = async function (req, res, next) {
    try {
      var content = await Pack.findOne().sort({ createdAt: -1 })
      return res.status(200).json({
        status: 200,
        data: content,
        message: "Succesfully found latest Pack",
      });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
  