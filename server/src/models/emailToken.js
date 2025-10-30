import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["verify-email", "reset-password"],
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 },
});
const Token = mongoose.model("tokens", tokenSchema);

export default Token;
