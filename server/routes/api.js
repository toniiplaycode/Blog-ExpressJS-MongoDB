import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

const initRoutes = (app) => {
    router.get("/", async (req, res) => {
        try {
            const locals = {
                title: "MongoDB Blog",
                footer: "Simple blog with ExpressJS & MongoDB"
            }

            //phân trang
            let perPage = 5;
            let page = req.query.page || 1;
            const data = await Post.find().sort({createAt: -1})
                        .skip(perPage * page - perPage)
                        .limit(perPage)
            const count = await Post.count();
            const nextPage = parseInt(page) + 1;
            const checkNextPage = nextPage <= Math.ceil(count / perPage);

            res.render("index", {
                locals, 
                data,
                current: page,
                nextPage: checkNextPage ? nextPage : null
                });
        } catch (error) {
            console.log("error: ", error);
        }

    })
    
    router.get("/post/:id", async (req, res) => {
        try {
            console.log("post detail id: ", req.params.id);
            const id = req.params.id;
            const data = await Post.findOne({_id: id});

            const locals = {
                title: data.title,
            }

            res.render("postDetail", {data, locals}); 
        } catch (error) {
            console.log("error: ", error);
        }
    })

    router.post("/search", async (req, res) => {
        try {
            console.log("search: ", req.body.searchValue);
            const searchValue = req.body.searchValue;
            const data = await Post.find({
                $or:[
                    {title: {$regex: searchValue, $options: "i"}},
                    {email: {$regex: searchValue, $options: "i"}},
                ]
            })
            res.render("search", {
                data
            });
        } catch (error) {
            console.log("error: ", error);
        }
    })
    

    router.get("/about", (req, res) => {
        res.render("about");
    })

    return app.use("/", router);
}

// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();

export default initRoutes;