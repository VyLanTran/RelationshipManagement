import express from "express";
import { addGroup, showAll } from "../controllers/groupControllers.js";

const router = express.Router();

router.post("/", addGroup);
router.get("/", showAll);

export default router;