import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { Server } from 'socket.io';
import hospitalRoutes from './routes/hospitalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import nurseRoutes from './routes/nurseRoutes.js';
import cleanerRoutes from './routes/cleanerRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URL;

// Database connection
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to the database'))
    .catch((e) => console.log('Database connection error: ' + e));

// Middleware
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: './temp/',
    })
);

// Register routes
app.use('/admin', adminRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/manager', managerRoutes);
app.use('/nurse', nurseRoutes);
app.use('/cleaner', cleanerRoutes);
app.use('/receptionist', receptionistRoutes);
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);

// Error handler middleware
app.use(errorHandler);

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Set up Socket.IO
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log(`User connected & Socket ID is ${socket.id}`);

    // Emit data to the client
    socket.emit('Data', 'Welcome to the server!');

    socket.on('disconnect', () => {
        console.log(`Socket ID ${socket.id} disconnected`);
    });
});
