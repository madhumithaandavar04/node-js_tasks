import express from "express";
import * as buddyController from "../controllers/buddyController.js";

//create router
const router = express.Router();

//get all buddies
router.get("/", buddyController.getBuddies);
//get a buddy
router.get("/:query", buddyController.getBuddy);
//create a buddy
router.post("/", buddyController.createBuddy);
//update a buddy
router.put("/:id", buddyController.updateBuddy);
//delete a buddy
router.delete("/:id", buddyController.deleteBuddy);

export default router;