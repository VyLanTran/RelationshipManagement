import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  addMembers,
  createGroupChat,
  getAllChats,
  getAllMyChats,
  getChat,
  getOrCreatePrivateChat,
  removeMembers,
  renameChat,
  searchChats,
} from "../controllers/chatController.js";

const router = express.Router();

// middleware to ensure that user must be authenticated before they can use any of these routes
router.use(verifyAuth);

router.get("/search", searchChats);
router.get("/:chatId", getChat);
router.get("/", getAllMyChats);
router.post("/", getOrCreatePrivateChat);
router.post("/group", createGroupChat);
router.put("/:chatId/rename", renameChat);
router.put("/:chatId/add", addMembers);
router.put("/:chatId/remove", removeMembers);

export default router;
