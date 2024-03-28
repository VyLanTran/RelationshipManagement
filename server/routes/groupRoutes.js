import express from "express";
import { addGroup } from "../controllers/groupControllers.js";

const router = express.Router();

router.post("/", addGroup);

export default router;