const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    location: {
      type: String,
      required: [true, "Please enter the property location"],
      trim: true,
    },
    room: {
      type: Number,
      required: [true, "Please enter the number of rooms"],
    },
    amount: {
      type: Number,
      required: [true, "Please enter the property amount"],
    },
    landsize: {
      type: Number,
      required: [true, "Please enter the property size"],
    },
    propertytype: {
      type: String,
      required: [true, "Please enter the property type 'House' or 'Land'"],
      enum: ["land", "house"],
    },

    media: {
      images: {
        type: [String],
      },
      videos: {
        type: [String],
      },
    },
},
  { timestamps: true }
);

const PROPERTY = mongoose.model("Property", propertySchema);
module.exports = PROPERTY;
