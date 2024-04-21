import express from "express";
import {
  addDiary,
  showAll,
  deleteDiary,
  showDiary,
  editDiary,
  showAllDiary,
} from "../controllers/diaryController.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

//  middleware to ensure that user must be authenticated before other routes can be handled
router.use(verifyAuth);

router.post("/user/:user", addDiary);
router.get("/user/:user", showAll);
router.delete("/:id", deleteDiary);
router.get("/:id", showDiary);
router.put("/:id", editDiary);
router.get("/", showAllDiary);

export default router;
