const express = require('express');
const foodPartnerController = require('../controllers/food-partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();


const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id',  foodPartnerController.getFoodPartnerById);

// POST avatar upload (authenticated food partner only)
router.post('/:id/avatar', authMiddleware.authFoodPartnerMiddleware, upload.single('avatar'), foodPartnerController.uploadAvatar);


module.exports = router;
