import multer from "multer";
import { ALLOWED_MIME_TYPES, MAX_RESUME_SIZE } from "../constants/upload.constants.js";
import ApiError from "../utils/ApiError.js";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname).toLowerCase();

    if(!ALLOWED_MIME_TYPES.includes(file.mimetype) &&
    extension !== ".pdf")
    {
        return cb(
            new ApiError(
                400,
                "Only PDF files are allowed"
            ),
            false
        );
    }

    cb(null, true);
};

const upload = multer({

    storage,

    fileFilter,

    limits:{
        fileSize: MAX_RESUME_SIZE
    }

});

export default upload;