import { PDFParse } from "pdf-parse";
import ApiError from "../utils/ApiError.js";

export const extractTextFromPdf = async (buffer) => {
    try {
        const parser = new PDFParse({data: buffer,});

        const result = await parser.getText();

        await parser.destroy();

        return result.text.trim();

    } catch (error) {
        console.error(error);

        throw new ApiError(
            400,
            "Unable to extract text from the PDF"
        );
    }
};