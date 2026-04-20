import express from "express";
import * as buddyController from "../controllers/buddyController.js";

// create router
const router = express.Router();

// routes
router.get("/",buddyController.getBuddies);
router.get("/:query",buddyController.getBuddy);
router.post("/",buddyController.createBuddy);
router.put("/:id",buddyController.updateBuddy);
router.delete("/:id",buddyController.deleteBuddy);

export default router;
