import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import adminRoutes from './routes/adminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import nurseRoutes from './routes/nurseRoutes.js';
import cleanerRoutes from './routes/cleanerRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';


const app = express();
dotenv.config();

//all the ports from dotenv

const port = process.env.PORT ;
const url = process.env.MONGO_URL ;


// app listen
app.listen(port,(req, res,next) =>{



    console.log(`Server is running on port ${port}`);
})

//database connection
mongoose.connect(url).then(()=>{
    console.log(`Connected to the database`);
}).catch((e)=>console.log("database connection error: " + e));

// all the middleware are here

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
     credentials: true,
     preflightContinue: false,
    }));
    
    app.use(express.json());
    
    app.use(morgan("dev"));
    
    app.use (cookieParser());
    
    app.use(express.urlencoded({extended: true}));
    
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: './temp/',
    }));
    



//all routes are here

app.use('/admin', adminRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/manager', managerRoutes);
app.use('/nurse', nurseRoutes);
app.use('/cleaner', cleanerRoutes);
app.use('/receptionist', receptionistRoutes);
