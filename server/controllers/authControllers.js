import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import validator from "validator";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, confirmPassword } =
      req.body;

    // Check if all inputs are valid before actually create a new user
    if (!firstName || !lastName || !email || !username || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }
    const exists = await UserModel.findOne({ email });
    if (exists) {
      throw Error("This email already existed");
    }
    if (password != confirmPassword) {
      throw Error("Confirm password doesn't match");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error(
        "Password must be at least 12 characters and contain uppercase letters, lowercase letters, numbers, and symbols"
      );
    }

    // Create a new user
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(201).json({ ...user.toObject(), token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all inputs are valid before actually create a new user
    if (!email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }
    // Check if an user with that email exists in our database
    const user = await UserModel.findOne({ email: email }).lean(); // findOne() is a form of MongoDB query, returning instance of User schema

    // If no such email is found in the database
    if (!user) {
      throw Error("This email doesn't match an account");
    }

    // Check if password is matched
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw Error("Password is incorrect");
    }

    const token = createToken(user._id);

    res.status(201).json({ ...user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
