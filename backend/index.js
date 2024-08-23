import express from "express";
import multer from 'multer';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from "./routes/postRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*', // or your frontend domain
  allowedHeaders: ['Content-Type', 'authToken']
}));

//database connection;
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Failed to connect to MongoDB', err);
});
//configure multer to handle files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//endpoint for user authorization and authentication.
app.use("/auth", authRoutes)
//endpoint  post handling.
app.use("/post", upload.single("file"), postRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});