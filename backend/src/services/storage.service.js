require('dotenv').config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadFile = async (file, fileName) => {
    try {
        // Validation: Ensure the imagekit instance exists
        if (!imagekit || typeof imagekit.upload !== 'function') {
            throw new Error("ImageKit SDK not initialized correctly");
        }

        const result = await imagekit.upload({
            file: file,     // If using Multer, this is 'file.buffer'
            fileName: fileName,
        });

        return result; // Returns the full object (includes url, fileId, etc.)
    } catch (error) {
        console.error("ImageKit Upload Error:", error.message);
        throw error; // Re-throw so your controller knows it failed
    }
}

module.exports = {
    uploadFile
}
