const PROPERTY = require("../Model/property");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// create a property
const createproperty = async (req, res) => {
  const { location, room, amount, landsize, propertytype } = req.body;

  try {
    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
  }

  const files = req.files;
  let uploadPromises = [];
  console.log(files);

  // Check if multiple files are uploaded
  if (Array.isArray(files)) {
      files.forEach(file => {
          uploadPromises.push(
              cloudinary.uploader.upload(file.tempFilePath, {
                  folder: 'uploads'  // Optional: specify a folder in Cloudinary
              }),
              console.log(file.tempFilePath)
          );
      });
  } else {
      uploadPromises.push(
          cloudinary.uploader.upload(files.tempFilePath, {
              folder: 'uploads'  // Optional: specify a folder in Cloudinary
          }),
          console.log(files.tempFilePath)
      );
  }
  // console.log(uploadPromises);

  // const uploadResults = await Promise.all(uploadPromises);
  // console.log(uploadResults.valueOf);
    // const video = req.files.video.tempFilePath;
    // console.log(req.files);
    // if (!Array.isArray(uploadedFiles)) {
    //   uploadedFiles = [uploadedFiles];
    // }
    // IMAGES upload
    // const result = await cloudinary.uploader.upload(
    //   req.files.image.tempFilePath,
    //   {
    //     use_filename: true,
    //     folder: "PostitAsset",
    //     resource_type: "auto",
    //   }
    // );

    // const secure_url = result.secure_url;
    // fs.unlinkSync(req.files.image.tempFilePath);

    // Video Upload

    // const videoResult = await cloudinary.uploader.upload(video, {
    //   resource_type: "video",
    //   folder: "betahomevideos",
    // });
    // console.log(videoResult);
    // const video_url = videoResult.secure_url
    // fs.unlinkSync(req.files.video.tempFilePath);

    // Set up media
    console.log(uploadPromises.promiseDispatch);

    const media = {
      // images: [uploadPromises],
      // videos: [video_url],
    };

    // Create property
    req.body.createdBy = req.user._id;
    const property = await PROPERTY.create({location,
      room,
      amount,
      landsize,
      propertytype,
      media
      })

    res.status(201).json({
      success: true,
      message: "Successfully created a Property Post",
      property,
    });
    console.log(req.user._id);
  } catch (error) {
    console.log(req.user._id);
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//delete a user post
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await PROPERTY.findById(propertyId);
    if (!property) {
      console.log(`Property with ID ${propertyId} not found`);
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Ensure the user who created the property is the one deleting it
    if (property.createdBy !== req.user._id) {
      console.log(`User ${req.user._id} is not authorized to delete property ${propertyId}`);
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this property' });
    }

    await PROPERTY.findByIdAndDelete(propertyId);
    console.log(`Property with ID ${propertyId} deleted by user ${req.user._id}`);
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.log(`Error occurred while deleting property with ID ${propertyId}: ${error.message}`);
    res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
};

//update a user post
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    // Find the property by ID
    const property = await PROPERTY.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Ensure the user who created the property is the one updating it
    if (property.createdBy !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this property' });
    }

    // Update the property with the data from the request body
    const updatedProperty = await PROPERTY.findByIdAndUpdate(
      propertyId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
};

// single product
const singleproperty = async (req, res) => {
  const { propertyId } = req.params;
  
  try {
    const property = await PROPERTY.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, message: "Single property", property });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get products
const allproperty = async (req, res) => {
  try {
    const properties = await PROPERTY.find();
    if (properties && properties.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "no product(s) found / created yet" });  
      return;
    }

    res.status(200).json({ status: true, message: `all products ${properties.length}`, properties });
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ success: false, message: error });
  }
};

const getHouseProperties = async (req, res) => {
  try {
    // Fetch properties with propertytype "house"
    const houseProperties = await PROPERTY.find({ propertytype: "house" }).sort({ createdAt: -1 }).limit(3);
    console.log("Fetched house properties:", houseProperties);

    // Copy the fetched properties to a new array
    const featuredProperties = [...houseProperties];
    console.log("Featured properties:", featuredProperties);

    // Send the response with the fetched properties
    res.status(200).json({ success: true, properties: featuredProperties });
  } catch (error) {
    // Log the error and send a 500 status response with the error message
    console.error("Error fetching properties:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createproperty,
  deleteProperty,
  updateProperty,
  singleproperty,
  allproperty,
  getHouseProperties
};

