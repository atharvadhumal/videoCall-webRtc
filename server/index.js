import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./db/dbConnect.js";
import authRout from "./rout/authRout.js";
import userRout from "./rout/userRout.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);

const allowedOrigins = [process.env.CLIENT_URL]; // Replace with your client's URL

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], //only allows these type of requests to be made to the server from the client
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRout);
app.use("/api/user", userRout);

app.get("/", (req, res) => {
  res.json("wow");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins[0],
    methods: ["GET", "POST"],
  },
});

console.log("Success Socket IO initialized");

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Info - new conecction established with socket id: ", socket.id);

  socket.emit("me", socket.id);

  socket.on("join", (user) => {
    if (!user || !user.id) {
      console.log("Error - user data is missing or invalid");
      return;
    }
    socket.join(user.id);
    const exstingUser = onlineUsers.find((u) => u.userId === user.id);
    if (exstingUser) {
      exstingUser.socketId = socket.id;
    } else {
      onlineUsers.push({ userId: user.id, socketId: socket.id });
    }

    io.emit("online-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.find((u) => u.socketId === socket.id);
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);

    io.emit("online-users", onlineUsers);

    socket.broadcast.emit("diconnected", { disUser: socket.id });

    console.log("Info - socket disconnected with id: ", socket.id);
  });
});

const startServer = async () => {
  try {
    await dbConnect();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

startServer();
