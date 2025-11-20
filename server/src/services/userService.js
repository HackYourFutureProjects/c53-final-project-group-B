import User from "../models/User.js";
import bcrypt from "bcryptjs";

export class ServiceError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
export const createUser = async (data) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    taskType,
    maxDistance,
    minPrice,
  } = data;

  if (!name || !email || !password || !role) {
    throw new ServiceError("Missing required fields", 400);
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    throw new ServiceError("Invalid email format", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ServiceError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    taskTypes: Array.isArray(taskType)
      ? taskType
      : taskType
        ? [taskType]
        : undefined,
    maxDistance: maxDistance ?? null,
    minPrice: minPrice ?? null,
  });
  return newUser;
};
