import express from "express";
import * as buddyController from "../controllers/buddyController/buddyController.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";

//create router
const router = express.Router();

//get all buddies
router.get("/", verifyToken, authorizeRoles('admin', 'manager'), buddyController.getBuddies);
//get a buddy
router.get("/:query", buddyController.getBuddy);
//update a buddy
router.put("/:id", buddyController.updateBuddy);
//delete a buddy
router.delete("/:id", buddyController.deleteBuddy);

export default router;