import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import upload from "../middlewares/upload.middleware.js";
import { deleteResumeByUser, getResumeByUser, uploadOrReplaceResume } from "../services/upload.service.js";


export const uploadResume = asyncHandler(async (req, res, next) => {

    // If Multer throws any errors, then those errors need to be forwarded to our global error handler. So we'll create a wrapper.
    upload.single("resume")(req, res, async (err) => {
        try {
            if (err) return next(err);

            if (!req.file) {
                return next(new ApiError(400, "Resume PDF is required"));
            }

            const result = await uploadOrReplaceResume(
                req.file,
                req.user.id
            );

            return res.status(201).json(
                new ApiResponse(
                    201,
                    result,
                    "Resume uploaded successfully"
                )
            );

        } catch (error) {
            next(error);
        }
    });
});


export const getResume = asyncHandler(async (req, res) => {
    const resume = await getResumeByUser(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            resume,
            "Resume fetched successfully"
        )
    );
});

export const deleteResume = asyncHandler(async (req, res) => {
    await deleteResumeByUser(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Resume deleted successfully"
        )
    );
});

