import jwt from "jsonwebtoken";

/**
 * verifyToken middleware acts as an authentication middleware,
 * ensuring that only authenticated users with valid JWT tokens can access certain routes in the application
 * next: callback function to call the next middleware in the stack
 */
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) return res.status(403).send("Access denied");

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
