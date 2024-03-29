import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
/**
 * verifyToken middleware acts as an authentication middleware,
 * ensuring that only authenticated users with valid JWT tokens can access certain routes in the application
 * next: callback function to call the next middleware in the stack
 */
export const verifyAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ error: "Authorization token is required" });

  const token = authorization.split(" ")[1]; // because token has the for "Bearer <token>"

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
