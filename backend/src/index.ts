import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parses the url to create parameters
app.use(cors());

app.use("/api/users", userRoutes);

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
