const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        // required: true,
      }
}, {timestamps:true})

const Subscription = mongoose.model("subscription", SubscriptionSchema);
module.exports = Subscription;
