const Subscription = require("../Model/Subcribe");
const USER = require("../Model/user");
const axios = require("axios");
const sendEmail = require("../helpers/sendMail");

// Paystack secret key from environment variables
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

// Initialize a payment
const createPayment = async (req, res) => {
  const { name, phonenumber, email, amount } = req.body;

  // Ensure amount is in kobo (Paystack accepts amounts in kobo)

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        name,
        phonenumber,
        email,
        amount
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send the authorization URL to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Payment initialization error:", error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

// Verify payment
const getPayment = async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    // Check if payment was successful
    if (response.data.data.status === "success") {
      res
        .status(200)
        .json({
          message: "Payment verified successfully",
          data: response.data,
        });
    } else {
      res
        .status(400)
        .json({ message: "Payment verification failed", data: response.data });
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// Subscription function
const subscription = async (req, res) => {
  const { email } = req.body;

  try {
    // Check for existing subscription
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: "Email is already subscribed." });
    }

    // Generate password reset URL (replace with actual logic for generating a secure token)
    const resetUrl = `https://yourapp.com/reset-password?token=somegeneratedtoken`; // Replace with your actual token generation logic

    const message = `<h1>Thank you for subscribing to Mouth Throne Platoam</h1>
                       <p>Please go to this link to reset your password</p>
                       <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>`;

    // Send subscription email
    await sendEmail({
      to: email,
      subject: "Password Reset Request", // Updated subject
      html: message, // Ensure you're sending HTML email
    });

    // Create a new subscription
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    // Fetch user details (assuming the user exists and is associated with the email)
    const user = await USER.findOne(req.body);

    // Include user details in the response
    res.status(200).json({
      success: true,
      message: "Thanks For Subscribing",
      subscription: newSubscription,
      user, // Send user details in response
    });
  } catch (error) {
    console.error("Subscription error:", error.message);
    res
      .status(500)
      .json({ message: "Email couldn't be sent", error: error.message });
  }
};

module.exports = {
  createPayment,
  getPayment,
  subscription,
};
