const express = require('express');
const foodController = require('../controllers/food.controller');
const authMidlleware = require('../middlewares/auth.middleware');

const router = express.Router();
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
})




/*Post /api/auth/ protected */
router.post('/', authMidlleware.authFoodPartnerMiddleware, upload.single('video'), foodController.createFood);

/*Get /api/auth/ protected */
router.get('/', authMidlleware.authUserMiddleware, foodController.getFoodItems);

router.post('/like', authMidlleware.authUserMiddleware, foodController.likeFood);

router.post('/unlike', authMidlleware.authUserMiddleware, foodController.unlikeFood);

router.post('/save', authMidlleware.authUserMiddleware, foodController.saveFood); 

module.exports = router;
