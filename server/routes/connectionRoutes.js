import express from "express";
import {
	createConnection,
	getAllConnections,
	getConnection,
	deleteConnection,
	updateConnection,
} from "../controllers/connectionControllers.js";

const router = express.Router();

router.get("/", getAllConnections);
router.get("/:id", getConnection);
router.delete("/:id", deleteConnection);
router.post("/", createConnection);
router.put("/:id", updateConnection);

export default router;
