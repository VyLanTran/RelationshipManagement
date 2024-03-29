import express from "express";
import { addGroup, showAll, deleteGroup, showGroup, editGroup} from "../controllers/groupControllers.js";

const router = express.Router();

router.post("/", addGroup);
router.get("/", showAll);
router.delete("/:id", deleteGroup);
router.get("/:id", showGroup);
router.put("/:id", editGroup);

export default router;