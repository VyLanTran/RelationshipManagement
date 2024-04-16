import express from "express";
import {
  addGroup,
  showAll,
  deleteGroup,
  showGroup,
  editGroup,
  showMember,
} from "../controllers/groupControllers.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

//  middleware to ensure that user must be authenticated before other routes can be handled
router.use(verifyAuth);

router.post("/", addGroup);
router.get("/user/:user", showAll);
router.delete("/:id", deleteGroup);
router.get("/:id", showGroup);
router.put("/:id", editGroup);
router.get("/:id/members", showMember);

export default router;
