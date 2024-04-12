import express from "express";

import {
  getAllUsers,
  getUser,
  updateUser,
  createProfilePicture,
  createCoverPhoto,
  getAllFriends,
} from "../controllers/userControllers.js";

import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

// middleware to ensure that user must be authenticated before they can use any of these routes
router.use(verifyAuth);

router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.get("/:userId/friends", getAllFriends);
router.patch("/:userId", updateUser);
router.patch("/:userId/profilePicture", createProfilePicture);
router.patch("/:userId/coverPhoto", createCoverPhoto);

export default router;
