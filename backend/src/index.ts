import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import hotelRoutes from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parses the url to create parameters
app.use(
  cors({
    origin: process.env.FRONTEND_URL, //only accepts url that is defined in .env file which will protect app from other suspicious urls
    credentials: true,
  })
);

//this means go to frontend dist folder which has compiled front end static assets and serve those static assets on the root of our URL that the backend runs on
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("api/my-hotels", hotelRoutes);

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
