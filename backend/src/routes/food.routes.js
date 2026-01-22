const express = require('express');
const foodController = require('../controllers/food.controller');
const authMidlleware = require('../middlewares/auth.middleware');

const router = express.Router();
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
})




/*Post /api/auth/ protected */
router.post('/', authMidlleware.authFoodPartnerMiddleware, upload.single('video'), foodController.createFood);

/*Get /api/food protected */
router.get('/', authMidlleware.authUserMiddleware, foodController.getFoodItems);

router.post('/like', authMidlleware.authUserMiddleware, foodController.likeFood);

router.post('/save', authMidlleware.authUserMiddleware, foodController.saveFood); 

module.exports = router;
