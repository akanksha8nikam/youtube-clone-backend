import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },
  joinedon: { type: Date, default: Date.now },

  // Subscription fields
  subscriptionPlan: {
    type: String,
    enum: ["FREE", "BRONZE", "SILVER", "GOLD"],
    default: "FREE",
  },
});

export default mongoose.model("user", userschema);