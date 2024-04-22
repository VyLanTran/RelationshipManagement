import express from "express";
import {
  addEvent,
  showAll,
  deleteEvent,
  showEvent,
  editEvent
} from "../controllers/eventController.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

//  middleware to ensure that user must be authenticated before other routes can be handled
router.use(verifyAuth);

router.post("/", addEvent);
router.get("/user/:user", showAll);
router.delete("/:id", deleteEvent);
router.get("/:id", showEvent);
router.put("/:id", editEvent);

export default router;
