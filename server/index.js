import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], //only allows these type of requests to be made to the server from the client
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("wow");
});

// async () => {
//   try {
app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1);
//   }
// };
