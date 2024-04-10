import express from "express";

import {
  createProfilePicture,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userControllers.js";

import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

// middleware to ensure that user must be authenticated before they can use any of these routes
router.use(verifyAuth);

router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.patch("/:userId", updateUser);
router.patch("/:userId/profilePicture", createProfilePicture);

export default router;
