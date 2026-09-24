import dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    ACCESS_SECRET:process.env.ACCESS_SECRET,
    ACCESS_SECRET_EXPIRE:process.env.ACCESS_SECRET_EXPIRE,
    REFRESH_SECRET:process.env.REFRESH_SECRET,
    REFRESH_SECRET_EXPIRE:process.env.REFRESH_SECRET_EXPIRE
};
