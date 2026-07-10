import multer from "multer";

const errorHandler = (err, req, res, next) => {

    if(err instanceof multer.MulterError){
        if(err.code === "LIMIT_FILE_SIZE"){
            return res.status(413).json({
                success: false,
                message: "Maximum file size is 5MB"
            });
        }
    }


    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== 'production' && {stack: err.stack}),
    });
};

export default errorHandler;