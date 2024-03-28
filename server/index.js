import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/connections", connectionRoutes);

const PORT = process.env.PORT || 8080;
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		app.listen(PORT, () => console.log(`Successfully connect to port ${PORT}`));
	})
	.catch((err) => console.log(`${err}`));
