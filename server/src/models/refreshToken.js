import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    indexes: [{ fields: { expiresAt: 1 }, expireAfterSeconds: 0 }],
  },
);

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
export default RefreshToken;
