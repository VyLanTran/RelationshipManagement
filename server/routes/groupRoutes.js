import express from "express";
import { addGroup, showAll, deleteGroup, showGroup } from "../controllers/groupControllers.js";

const router = express.Router();

router.post("/", addGroup);
router.get("/", showAll);
router.delete("/:id", deleteGroup);
router.get("/:id", showGroup);

export default router;