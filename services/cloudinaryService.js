const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


const updateImage = async (filePath, publicId) => {
  try {
    const result = await uploadImage(filePath);
    await deleteImage(publicId);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  updateImage,
};
