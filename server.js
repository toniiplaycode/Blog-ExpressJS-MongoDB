import express from "express";
import dotenv from "dotenv";
import expressLayout from "express-ejs-layouts";
import initRoutes from "./routes/api.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT;

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