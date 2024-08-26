const Product = require("../Model/item");
const cloudinary = require("cloudinary").v2;
const fs = require('fs');

// Create a new product and upload images to Cloudinary
const createProduct = async (req, res) => {
  
    const { name, description, price, category, brand, stock } = req.body;
    const images = req.files.images;
    console.log(images);

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image." });
    }

   
    
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < images.length; i++) {
        console.log(images[i]); // Debugging: Check the individual image object structure
    
        const result = await cloudinary.uploader.upload(images[i].tempFilePath, {
          use_filename: true,
          folder: "MouthThrownAsset/items",
          resource_type: "auto",
        });
    
        const secure_url = result.secure_url;
        uploadedImages.push(secure_url);
    
        // Remove the temporary file
        fs.unlinkSync(images[i].tempFilePath);
      }
    
      // Assign the array of secure URLs to req.body.images
      req.body.images = uploadedImages;
    
      const item = await Product.create({ ...req.body });
      res.status(201).json({ success: true, message: "Add New Item successful", item });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error);
    }

};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a product
const rateProduct = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.ratings.numberOfRatings += 1;
    product.ratings.averageRating =
      (product.ratings.averageRating * (product.ratings.numberOfRatings - 1) +
        rating) /
      product.ratings.numberOfRatings;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a review to a product
const addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = {
      user: req.user._id,
      comment,
      rating,
      date: Date.now(),
    };

    product.reviews.push(review);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  rateProduct,
  addReview,
};
