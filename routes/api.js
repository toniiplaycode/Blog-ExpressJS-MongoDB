import express from "express";

const router = express.Router();

const initRoutes = (app) => {
    router.get("/", (req, res) => {
        const locals = {
            title: "MongoDB Blog",
            description: "Simple blog with ExpressJS & MongoDB"
        }
        res.render("index", {locals});
    })
    
    router.get("/about", (req, res) => {
        res.render("about");
    })

    return app.use("/", router);
}

export default initRoutes;