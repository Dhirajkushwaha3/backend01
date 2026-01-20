const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');


async function getFoodPartnerById(req, res) {
    
        const foodPartnerId = req.params.id;
       const foodPartner = await foodPartnerModel.findById(foodPartnerId);

       const foodItemByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

        if (!foodPartner) {
            return res.status(404).json({ message: 'Food Partner not found' });
        }
        res.status(200).json({
            message: 'Food Partner fetched successfully',
            foodPartner: {
               ...foodPartner.toObject(),
               foodItems: foodItemByFoodPartner
            }
           
        });
    }

    async function uploadAvatar(req, res) {
        try {
            const partnerId = req.params.id;
            // Only allow the authenticated foodPartner to update their own avatar
            if (!req.foodPartner) {
                console.warn('uploadAvatar: no req.foodPartner present - decoded token may be missing or cookie not sent');
                return res.status(401).json({ message: 'Authentication required' });
            }
            if (req.foodPartner._id.toString() !== partnerId) {
                console.warn(`uploadAvatar: ownership mismatch. tokenId=${req.foodPartner._id.toString()} paramId=${partnerId}`);
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (!req.file || !req.file.buffer) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Use original filename with timestamp to avoid collisions
            const filename = `${partnerId}_avatar_${Date.now()}`;
            const uploadResult = await storageService.uploadFile(req.file.buffer, filename);

            if (!uploadResult || !uploadResult.url) {
                return res.status(500).json({ message: 'Failed to upload image' });
            }

            // Save avatar URL to partner
            const updated = await foodPartnerModel.findByIdAndUpdate(partnerId, { avatar: uploadResult.url }, { new: true });

            return res.status(200).json({ message: 'Avatar uploaded', avatar: uploadResult.url, foodPartner: updated });
        } catch (err) {
            console.error('uploadAvatar error', err.message || err);
            return res.status(500).json({ message: 'Server error during avatar upload' });
        }
    }

    module.exports = {
        getFoodPartnerById,
        uploadAvatar
    };
    
