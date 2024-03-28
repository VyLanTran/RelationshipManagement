import express from "express";
import {
	createConnection,
	getAllConnections,
} from "../controllers/connectionControllers.js";

const router = express.Router();

router.get("/", getAllConnections);
router.post("/", createConnection);

export default router;
