const { Pack } = require("../models/Pack");

// GET ALL Packs
exports.getPacks = async function (query, page, limit) {
    try {
        var content = await Pack.find(query);
        return content;
    } catch (e) {
        throw Error(e);
    }
};

// GET Pack BY ID
exports.getPackById = async function (id) {
    try {
        var content = await Pack.findById(id);
        return content;
    } catch (e) {
        throw Error(e);
    }
};

//ADD Pack
exports.addPack = async function(document) {
    try {
        var content = await Pack.create(document);
        return content;
    }
    catch (e) {
        console.log(e);
        throw Error(e);
    }
};

// REMOVE Pack
exports.removePack = async function (id) {
    try {
        var content = await Pack.findByIdAndDelete(id);
        return content;
    } catch (e) {
        throw Error(e);
    }
};
