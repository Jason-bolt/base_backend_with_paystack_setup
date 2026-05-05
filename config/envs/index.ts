import "dotenv/config";

interface EnvVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM_NAME: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_TOKEN_EXPIRY: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLIENT_URL: string;
}

const envs: EnvVariables = {
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  EMAIL_HOST: process.env.EMAIL_HOST || "",
  EMAIL_PORT: process.env.EMAIL_PORT || "",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Lifescape",
  REDIS_URL: process.env.REDIS_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY || "1h",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export default envs;
