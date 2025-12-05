import mongoose from "mongoose";

import validateAllowedFields from "../util/validateAllowedFields.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    role: { type: String, enum: ["client", "courier"], required: true },
    address: { type: String, default: "" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    taskTypes: {
      type: [
        {
          type: String,
          enum: ["delivery", "shopping", "smalljob"],
        },
      ],
      default: ["delivery", "shopping", "smalljob"],
      required: false,
    },

    maxDistance: { type: Number, required: false },
    minPrice: { type: Number, required: false },

    isAvailable: { type: Boolean, default: true },
    trustScore: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    // Profile picture
    profilePicture: { type: String, default: "" },

    // Payment information
    paymentMethod: {
      cardNumber: { type: String, default: "" },
      cardHolderName: { type: String, default: "" },
      expiryDate: { type: String, default: "" },
      cardType: { type: String, default: "" },
    },
  },
  { timestamps: true },
);
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("users", userSchema);

export const validateUser = (userObject) => {
  const errorList = [];
  const allowedKeys = ["name", "email"];

  const validatedKeysMessage = validateAllowedFields(userObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (userObject.name == null) {
    errorList.push("name is a required field");
  }

  if (userObject.email == null) {
    errorList.push("email is a required field");
  }

  return errorList;
};

export default User;
