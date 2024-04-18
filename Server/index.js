require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express();

const URI = "mongodb+srv://praveenspk:spkmongoapp@cluster0.4siowje.mongodb.net/mern_admin?retryWrites=true&w=majority";

const connectDB = async()=>{
    try{
        await mongoose.connect(URI);
        console.log("Connected to DataBase Successfully");
    }catch(error){
        console.log(error)
        process.exit(0);
    }
}
app.use(cors())
app.use(express.json())
const router = require("./auth/auth-router");

app.use("/api/auth/", router);
const port = 5000;

connectDB().then(()=>{
app.listen(port,()=>{
    console.log(`app listening on port : ${port}`);
})
})
