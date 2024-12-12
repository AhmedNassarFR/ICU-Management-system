import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import { createServer } from "http";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import nurseRoutes from "./routes/nurseRoutes.js";
import cleanerRoutes from "./routes/cleanerRoutes.js";
import receptionistRoutes from "./routes/receptionistRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

export const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the application if database connection fails
  }
})();

// Middleware setup
// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     allowedHeaders: ['Authorization', 'Content-Type'],
//   })
// );


const allowedOrigins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow requests from allowed origins or non-browser clients
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Accept", "X-Requested-With"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

// Routes setup
app.use("/admin", adminRoutes);
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/manager", managerRoutes);
app.use("/nurse", nurseRoutes);
app.use("/cleaner", cleanerRoutes);
app.use("/receptionist", receptionistRoutes);
app.use("/user", userRoutes);
app.use("/hospital", hospitalRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the HTTP server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected with Socket ID: ${socket.id}`);

  // Emit welcome message on connection
  socket.emit("Data", "Welcome to the server!");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket ID ${socket.id} disconnected`);
  });

  // Example: Function to send updated ICU data to clients
  // const sendUpdatedICUs = (updatedICUs) => {
  //   console.log("Sending updated ICU data to all connected clients");
  //   io.emit("icuReserved", updatedICUs);
  // };

  // // Expose the `sendUpdatedICUs` function for external use (if needed)
  // // You can call this function from other parts of your application
  // app.set("sendUpdatedICUs", sendUpdatedICUs);
});
