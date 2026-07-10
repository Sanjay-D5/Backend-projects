import dotenv from "dotenv";

dotenv.config();

export const {
    PORT,
    MONGODB_URI,
    CLIENT_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;