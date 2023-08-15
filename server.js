import express from "express";
import dotenv from "dotenv";
import expressLayout from "express-ejs-layouts";
import initRoutes from "./server/routes/api.js";
import connectDB from "./server/config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectDB();

// dùng urlencoded và json để có thể post được data lên server
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

// dùng layout chung
app.use(expressLayout); 
app.set("layout", "./layouts/main");

initRoutes(app);

app.use((req, res) => { 
    return res.render("404.ejs");
})

app.listen(PORT, () => {
    console.log("server running");
})