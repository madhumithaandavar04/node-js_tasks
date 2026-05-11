import express from "express";
import { createBuddy } from "../controllers/buddyController.js";
import { loginUser, logoutUser, userProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

//create a express router
const router = express.Router();

//router for login user
router.post('/login', loginUser);
//router for register user
router.post('/register', createBuddy);
//router for get profile
router.get('/profile', verifyToken, userProfile);
//router for logout user
router.get('/logout', verifyToken, logoutUser);

export default router;