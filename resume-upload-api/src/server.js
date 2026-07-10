import "./config/env.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";

import { PORT } from "./config/env.js";

const startServer = async () => {
    await connectDB();

    app.listen(PORT || 6000, () => {
        console.log(`Server running on port ${PORT || 6000}`);
    });
};

startServer();