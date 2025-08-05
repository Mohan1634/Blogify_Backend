import express from "express";
import { addComment, deleteBlogById, getAllBlogs, getBlogById, getMyBlogs, uploadBlog } from "../controllers/blog.js";
import { upload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router=express.Router();


router.post("/new",isAuthenticated,upload.single("file"),uploadBlog);

router.get("/all",getAllBlogs);

router.get("/myblog",isAuthenticated,getMyBlogs);

router.delete("/deleteblog/:id",isAuthenticated,deleteBlogById);


router.get("/:id",getBlogById);


router.post("/comment/:blogId",isAuthenticated,addComment);




export default router;