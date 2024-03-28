import express from "express";
import { getAllConnections } from "../controllers/connectionControllers.js";

const router = express.Router();

router.get("/", getAllConnections);

export default router;
