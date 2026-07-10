import { extractTextFromPdf } from "./pdf.service.js";
import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary.service.js";
import Resume from "../models/resume.model.js";
import ApiError from "../utils/ApiError.js";

export const uploadOrReplaceResume = async (file, userId) => {
    const existingResume = await Resume.findOne({ user: userId });
    const buffer = file.buffer;
    
    const extractedText = await extractTextFromPdf(buffer);
    // Track the new upload result outside the try block for catch accessibility

    try {
        
        const uploadResult = await uploadToCloudinary(buffer);
    

        if (existingResume) {
            const oldPublicId = existingResume.publicId;

            existingResume.fileName = file.originalname;
            existingResume.fileSize = file.size;
            existingResume.url = uploadResult.secure_url;
            existingResume.publicId = uploadResult.public_id;
            existingResume.extractedText = extractedText;

            await existingResume.save();

            // Only delete the old file AFTER the new one is successfully saved to the DB
            if (oldPublicId) {
                await deleteFromCloudinary(oldPublicId);
            }

            return existingResume;
        }

        const resume = await Resume.create({
            user: userId,
            fileName: file.originalname,
            fileSize: file.size,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            extractedText,
        });

        return resume;

    } catch (error) {
        // Rollback: If Cloudinary succeeded but DB operations failed, delete the orphan
        if (uploadResult?.public_id) {
            try {
                await deleteFromCloudinary(uploadResult.public_id);
            } catch (cleanupError) {
                console.error("Failed to delete orphan file from Cloudinary:", cleanupError);
            }
        }
        
        // Re-throw the original error so your controller knows the operation failed
        throw error;
    }
};

export const getResumeByUser = async(userId) => {
    const resume = await Resume.findOne({
        user: userId,
    }).select("-extractedText");

    if(!resume){
        throw new ApiError(
            404,
            "Resume not found"
        );
    }

    return resume;
};

export const deleteResumeByUser = async (userId) => {
    const resume = await Resume.findOne({user: userId,});

    if(!resume){
        throw new ApiError(
            404,
            "Resume not found"
        );
    }

    await deleteFromCloudinary(resume.publicId);

    await resume.deleteOne();
};