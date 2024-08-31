const mongoose = require('mongoose');

// Define the schema for the product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["Appliances", "computer", "Phone","Fashion","Gadget","Baby Product","Books","Electronics","Kechine Items","Gaming"],
  },
  brand: {
    type: String,
    trim: true,
    maxlength: 50
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'There should be at least one image URL.'
    },
    required: true
  },
  ratings: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numberOfRatings: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
