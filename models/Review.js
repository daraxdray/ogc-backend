const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
      },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music'
    },
    podcast : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Podcast'
    },
    episode : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episode'
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
    },
    {
        timestamps: true,
    });
   

    exports.Review = mongoose.model("Review", reviewSchema);
    exports.reviewSchema = reviewSchema;
