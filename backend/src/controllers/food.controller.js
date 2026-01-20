const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const {likeModel} = require('../models/likes.model');
const saveModel = require('../models/save.model');
const {v4: uuid} = require('uuid');


async function createFood(req, res) {
  try {
    // Validate required pieces
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No video file uploaded. Please include a "video" file field.' });
    }
    if (!req.foodPartner || !req.foodPartner._id) {
      return res.status(401).json({ message: 'Unauthorized: food partner not found on request.' });
    }

    // Upload file to storage service
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    // Ensure upload returned a usable URL
    const videoUrl = (fileUploadResult && (fileUploadResult.url || fileUploadResult.filePath || fileUploadResult.fileId)) || null;
    if (!videoUrl) {
      return res.status(500).json({ message: 'File uploaded but storage service returned no URL.' });
    }

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url || fileUploadResult.filePath || fileUploadResult.fileId,
      foodPartner: req.foodPartner._id
    });

    return res.status(201).json({
      message: 'Food item created successfully',
      food: foodItem,
      _id: foodItem && foodItem._id
    });
  } catch (err) {
    console.error('createFood error:', err && err.message ? err.message : err);
    return res.status(500).json({ message: 'Internal server error while creating food item.' });
  }
}


async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({})
  res.status(200).json({
   message: 'food itemm fetched successfully',
   foodItems: foodItems
  })
}

async function likeFood(req, res) {
    const { foodId } =  req.body;
    const user = req.user;
    const isAlreadyLiked = await likeModel.findOne({
      user: req.user._id,
      food: foodId
    });
    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: req.user._id,
        food: foodId
      })


    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: -1 }
    });

      return res.status(200).json({ message: 'Food unliked successfully.' });
    }



    const like = await likeModel.create({
      user: req.user._id,
      food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: 1 }
    });

    res.status(200).json({
      message: 'Food liked successfully',
      like: like
});
}

async function unlikeFood(req, res) {
    const foodId =  req.body.foodId;
    const unlike = await foodModel.findOneAndDelete({
      user: req.user._id,
      food: foodId
    });

    res.status(200).json({
      message: 'Food unliked successfully',
      unlike: unlike
});
}

async function saveFood(req, res) {
   const {foodId} = req.body;
   const user = req.user;

   const isAlreadySaved = await saveModel.findOne({
    user: req.user._id,
    food: foodId
   });
    if (isAlreadySaved) {

      await saveModel.deleteOne({
        user: req.user._id,
        food: foodId
      });

      return res.status(200).json({ message: 'Food unsaved successfully.' });
    }
    const save = await saveModel.create({
      user: req.user._id,
      food: foodId
    });
    res.status(200).json({
      message: 'Food saved successfully',
      save: save
    });

}  





module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  unlikeFood,
  saveFood
}