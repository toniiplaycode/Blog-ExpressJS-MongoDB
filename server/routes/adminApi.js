import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

dotenv.config();
const router = express.Router();

const adminLayout = '../views/layouts/admin'; // dùng layout admin
const jwtsecret = process.env.JWT_SECRET;

// authMiddleware check đã đăng nhập admin hay chưa, nếu chưa sẽ không vào được các routes được thêm middleware này
const authMiddleware = (req, res, next) => {
    // giá trị của cookie có tên "token"
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Unauthorized !" 
        })
    }

    try {
        const decoded = jwt.verify(token, jwtsecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized !" 
        })
    }
}


const initAdminRoutes = (app) => {
    router.get("/", (req, res) => {
        try {
            return res.render("admin/index", {layout: adminLayout});
        } catch (error) {
            console.log("error: ", error);
        }
    })

    router.post("/login", async (req, res) => {
        try {
            const {username, password} = req.body;

            const admin = await Admin.findOne({username});

            // status 401: Unauthorized (không được uỷ quyền)
            if(!admin) {
                return res.status(401).json({
                    message: "Invalid credentials"
                })
            }

            const checkPassword = await bcrypt.compare(password, admin.password);

            if(!checkPassword) {
                return res.status(401).json({
                    message: "Invalid credentials"
                })
            }

            // tạo token và lưu vào cookies 
            const token = jwt.sign({ userId: admin._id }, jwtsecret);
            res.cookie("token", token, {httpOnly: true});

            res.redirect('/admin/dashBoard');
        
        } catch (error) {
             console.log("error: ", error);
        }
    })

    router.get("/dashBoard", authMiddleware, async (req, res) => {
        res.render("admin/dashBoard", {layout: adminLayout})
    })

    router.post("/register", async (req, res) => {
        try {
            const {username, password} = req.body;
             
            const hashPassword = await bcrypt.hash(password, 10); // (https://chat.openai.com/c/6609d831-53b1-4bd4-9ea3-e4ed4ad547d7)

            try {
                const admin = await Admin.create({username, password: hashPassword});
                
                // status 201: tạo tài nguyên mới thành công
                res.status(201).json({
                    message: "Created admin succcesful !",
                    admin
                })
            } catch (error) {
                // erro.code = 1100 là bị trùng dữ liệu, username mình để là unique và server sẽ phản hồi lại status 409 là conflict
                if(error.code === 11000) {
                    res.status(409).json({
                        message: "User already is use !"
                    })
                }
                res.status(500).json({
                    message: "Internal Server Error !"
                })
            }

        } catch (error) {
            console.log("error: ", error);
        }
    })


    return app.use("/admin", router);
}

export default initAdminRoutes;