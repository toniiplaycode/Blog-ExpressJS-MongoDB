import express from "express";
import dotenv from "dotenv";
import expressLayout from "express-ejs-layouts";
import connectDB from "./server/config/db.js";
import initRoutes from "./server/routes/api.js";
import initAdminRoutes from "./server/routes/adminApi.js";
import cookieParser from "cookie-parser"; // (https://chat.openai.com/c/dc2f8fc4-e238-4070-88a4-c11d4f53825f)
import MongoStore from "connect-mongo"; // (https://chat.openai.com/c/20f2af89-fe90-409b-ac4d-f4b07f2094be)
import session from "express-session"; // cấu hình session của expressJS

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cookieParser());
app.use(session({ //cấu hình session
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

connectDB();

// dùng urlencoded và json để có thể post được data lên server
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

// dùng layout ejs chung
app.use(expressLayout); 
app.set("layout", "./layouts/main");

initRoutes(app);
initAdminRoutes(app);

// nếu vào routes sai thì hiển thị trang 404 này
app.use((req, res) => { 
    return res.render("404.ejs");
})

app.listen(PORT, () => {
    console.log("server running");
})