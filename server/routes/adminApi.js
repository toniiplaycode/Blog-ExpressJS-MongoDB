import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Post from "../models/Post.js";

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
            const locals = {
                title: "Home Admin",
            }

            return res.render("admin/index", {layout: adminLayout, locals});
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
        const locals = {
            title: "Dashboard Admin",
        }
        
        const data = await Post.find();

        res.render("admin/dashBoard", {layout: adminLayout, locals, data})
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
                // erro.code = 1100 là bị trùng dữ liệu, username mình để bên models là unique và server sẽ phản hồi lại status 409 là conflict
                if(error.code === 11000) {
                    res.status(409).json({
                        message: "User already used, let use username other !"
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

    router.get("/add-post", authMiddleware, async (req, res) => {   
        const locals = {
            title: "Add Post",
        }

        res.render("admin/addPost", {layout: adminLayout, locals});
    })

    router.post("/add-post", authMiddleware, async (req, res) => {   
        try {
            await Post.create({
                title: req.body.title,
                body: req.body.body,
            });
            res.redirect("/admin/dashBoard");
        } catch (error) {
            console.log("error: ",error);
        }
    })

    router.get("/delete-post/:id", authMiddleware, async (req, res) => {   
        try {
            await Post.deleteOne({_id: req.params.id});
            res.redirect("/admin/dashBoard");
        } catch (error) {
            console.log("error: ",error);
        }
    })
    
    router.get("/edit-post/:id", authMiddleware, async (req, res) => {   
        try {
            const locals = {
                title: "Edit Post",
            }
            const data = await Post.findOne({_id: req.params.id})

            res.render("admin/editPost", {layout: adminLayout, data, locals});
        } catch (error) {
            console.log("error: ",error);
        }
    })

    router.post("/edit-post", authMiddleware, async (req, res) => {   
        try {
            await Post.findByIdAndUpdate(req.body.id, {
                title: req.body.title,
                body: req.body.body,
            })
            res.redirect("/admin/dashBoard");
        } catch (error) {
            console.log("error: ",error);
        }
    })

    router.get("/logout", async (req, res) => {
        res.clearCookie("token"); // xoá cookies tên "token"
        res.redirect("/admin");
    })

    return app.use("/admin", router);
}

export default initAdminRoutes; 