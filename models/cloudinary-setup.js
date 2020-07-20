const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret
});

const storage = new CloudinaryStorage({
    cloudinary,
    folder: 'Assets', // The name of the folder in cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'],
    // params: { resource_type: 'raw' }, => this is in case you want to upload other type of files, not just images
    filename: function(req, res, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname); // The file on cloudinary would have the same name as the original file name
    }
});

const uploader = multer({ storage });
module.exports = uploader;