import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage(); //stores any files i.e images from post request in memory not locally because getting the images and storing directly in cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/add",
  verifyToken,

  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel Type is required"),

    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),

    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"), //must be an array
  ],
  upload.array("imageFiles", 6), // this is going to be an array of images upto 6 items so upload.array and if not it will throw an error

  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[]; // will store image info in imageFiles array variable
      const newHotel: HotelType = req.body;

      //1. upload the images to cloudinary

      //mapping through imageFiles because cloudinary allows one image at a time to upload
      const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64"); //converting the image into base64 string so that it can be processd by cloudinary

        let dataURI = "data:" + image.mimetype + ";base64," + base64; //creating a string that describes the image wiht mimetype and base64 attached to it
        const res = await cloudinary.v2.uploader.upload(dataURI); //using the cloudinary sdk to upload it to cloudinary account
        return res.url; //returning the url that we are getting back on successful upload of image
      }); //on successful upload of all items in image array it will return Promise<string>[]

      //this will wait for all images to be uploaded before we get back a string[]
      //imageUrls will hold the list of image urls that we get from cloudinary
      const imageUrls = await Promise.all(uploadPromises);

      //2. if upload was successful, add the URLs to the new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; // getting userId of loggedin user from verifyToken middleware

      //3. save the new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //4. return a 201 status
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error creating hotel:", error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

export default router;
