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

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save(); // save() is a form of MongoDB query
    const token = createToken(savedUser._id);

    res.status(201).json({ savedUser, token });
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

    // Check if an user with that email exists in our database
    const user = await UserModel.findOne({ email: email }); // findOne() is a form of MongoDB query, returning instance of User schema

    // If no such email is found in the database
    if (!user) return res.status(400).json({ msg: "Email does not exist" });

    // Check if password is matched
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Password does not match" });

    const token = createToken(user._id);

    res.status(201).json({ msg: "Successfully log in", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
