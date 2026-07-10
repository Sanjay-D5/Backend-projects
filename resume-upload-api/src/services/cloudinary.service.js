import cloudinary from "../config/cloudinary.js";
import { CLOUDINARY_FOLDER } from "../constants/upload.constants.js";
import ApiError from "../utils/ApiError.js";

export const uploadToCloudinary = (buffer) => {

    return new Promise((resolve, reject)=>{

        // upload_stream() is callback-based so we use promise
        const stream =
            cloudinary.uploader.upload_stream({folder:CLOUDINARY_FOLDER, resource_type:"raw"},
                (error, result)=>{

                    if(error){
                        return reject(error);
                    }

                    resolve(result);

                }

            );

        stream.end(buffer);

    });

};

export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "raw",
            }
        );

        return result;
    } catch (error) {
        throw new ApiError(
            500,
            "Failed to delete file from Cloudinary"
        );
    }
};