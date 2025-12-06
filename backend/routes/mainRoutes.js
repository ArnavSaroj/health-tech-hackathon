import express from 'express'
import { addProfile, showProfile, updatePoints,checkProfile } from '../controllers/profile.js';
import { addFood, getFood, getTodayFood } from '../controllers/food.js';
import verifyDay from '../controllers/verify.js';

const router = express.Router();


// NOTE this are the profile routes
router.post("/addProfile", addProfile);
router.get("/profile:id", showProfile)
router.post("/updatePoints", updatePoints);
router.get("/checkProfile/:id", checkProfile);

// NOTE these are the food routes
router.get("/food/getFood:user_id", getFood);
router.get("food/getTodayFood", getTodayFood);
router.post("/food/addFood", addFood);


router.post("/verifyDay", verifyDay);

export default router;