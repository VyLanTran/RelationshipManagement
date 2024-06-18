import express from "express";
import {
    addProperty,
    getAllProperties,
    deleteProperty,
    updateProperty
} from "../controllers/propertyController.js"

const router = express.Router();

router.get("/:groupId", getAllProperties);
router.delete("/:id", deleteProperty);
router.put("/:id", updateProperty);
router.put("/", addProperty);

export default router;