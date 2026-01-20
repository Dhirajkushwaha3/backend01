const express = require('express');
const authController = require('../controllers/auth.controller');


const router = express.Router();


//User auth APIs
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.LoginUser);
router.get('/user/logout',authController.LogoutUser);

//Food Partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.LoginFoodPartner);
router.get('/food-partner/logout', authController.LogoutFoodPartner);
module.exports = router;