import { config } from "dotenv";

config({path: '.env'});

const requiredEnvVars = [
    "PORT", "MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"
];

for (const variable of requiredEnvVars) {
    if(!process.env[variable]){
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

export const {PORT, MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, NODE_ENV} = process.env;