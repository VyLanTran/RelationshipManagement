import express from "express";

import { getUser } from "../controllers/userControllers.js";

import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

// middleware to ensure that user must be authenticated before they can use any of these routes
router.use(verifyAuth);

router.get("/:userId", getUser);

export default router;
