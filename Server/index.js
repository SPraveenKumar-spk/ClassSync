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
var corsoptions = {
    origin : "https://localhost:5173",
    methods : "PUT,GET,POST,UPDATE",
    credentials: true
}

app.use(cors(corsoptions))
const router = require("./auth/auth-router");

app.use("/", router);
const port = 5000;

connectDB().then(()=>{
app.listen(port,()=>{
    console.log("app listening");
})
})
