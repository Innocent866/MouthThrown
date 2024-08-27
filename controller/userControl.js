const USER = require("../Model/user");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helpers/sendMail");
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Registration function
const registration = async (req, res) => {
  const { firstname, lastname, email, phonenumber, password, verifypassword, image } = req.body;

  if (!firstname || !lastname || !email || !phonenumber || !password || !verifypassword) {
    return res.status(400).json({ success: false, message: "All fields are required to register" });
  }

  if (password !== verifypassword) {
    return res.status(400).json({ success: false, message: "Password and verify password must be the same" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: "MouthThrownAsset/users",
      resource_type: "auto",
    });

    const secure_url = result.secure_url;
    req.body.image = secure_url;

    fs.unlinkSync(req.files.image.tempFilePath);

    const user = await USER.create({ ...req.body });
    res.status(201).json({ success: true, message: "Registration successful", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(404).json({ success: false, message: "Email address already in use" });
    }
    console.error(error.message);
    res.status(500).send(error);
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required to login" });
  }

  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Wrong credentials" });
    }

    const auth = await user.comparePassword(password);
    if (!auth) {
      return res.status(404).json({ success: false, message: "Wrong credentials" });
    }

    const token = await user.generateToken();
    res.status(201).json({
      success: true,
      message: "Logged in",
      user: {
        firstname: user.firstname,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Logout function
const logout = async (req, res) => {
  res.status(200).json({ token: "", message: "Logged out successfully" });
};

// Get all users function
const getAllUser = async (req, res) => {
  try {
    const users = await USER.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get user name function
const getUserName = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await USER.findOne({ _id: userId });
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Check if logged in function
const isLoggedIn = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json(false);
    }
    jwt.verify(token, process.env.JWT_SECRET);
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.json(false);
  }
};

// Forgot password function
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `https://jazzy-tuts-mern.vercel.app/password/${resetToken}`;
    const message = `<h1>You have requested a password reset</h1>
                     <p>Please go to this link to reset your password</p>
                     <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Email couldn't be sent", error });
  }
};

// Reset password function
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
  try {
    const user = await USER.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid reset token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(201).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  registration,
  login,
  logout,
  getAllUser,
  getUserName,
  isLoggedIn,
  forgotPassword,
  resetPassword
};
