import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';



const app = express();
dotenv.config();

//all the ports from dotenv

const port = process.env.PORT ;
const url = process.env.MONGO_URL ;


// app listen
app.listen(port,(req, res) =>{
    console.log(`Server is running on port ${port}`);
})

//database connection
mongoose.connect(url).then(()=>{
    console.log(`Connected to the database`);
}).catch((e)=>console.log("database connection error: " + e));

// middleware




//all routes are here