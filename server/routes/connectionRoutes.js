import express from "express";
import {
	createConnection,
	getAllConnections,
	getConnection,
} from "../controllers/connectionControllers.js";

const router = express.Router();

router.get("/", getAllConnections);
router.get("/getConnection", getConnection);
router.post("/", createConnection);

export default router;
