import Blog from "../models/blog.js"
import {uploadFile} from "../helpers/upload.js";
import ErrorHandler from "../middlewares/error.js";
import Comment from "../models/comment.js";
import fs from "fs";

export const uploadBlog=async (req,res,next)=>{
       try {
        const {title,body}=req.body;

        if (!req.file) {
            return next(new ErrorHandler("No File Uploaded",400));
        }
       const secure_url=await uploadFile(req.file.path);

      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });

       const blog=await Blog.create({
             title,
             body,
             coverImageURL:secure_url,
             createdBy:req.user._id,
       })
       return res.status(201).json({
        success:true,
        message:"Blog Uploaded Succesfully",
        id:blog._id,
       })
       } catch (error) {
         next(error);
       }
}

export const getAllBlogs=async (req,res,next)=>{
    try {
    const blogs=await Blog.find({}).populate("createdBy");
    return res.status(200).json({
        success:true,
        blogs,
    })
    } catch (error) {
      next(error);
    }
}

export const getBlogById=async(req,res,next)=>{
    try {
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({blogId : req.params.id}).populate("createdBy");

    if(!blog){
        return next(new ErrorHandler("Blog Not Found",404));
    }
    
    return res.status(200).json({
        success:true,
        blog,
        comments,
    });
    } catch (error) {
        return next(error);
    }
}

export const addComment=async (req,res,next)=>{
    try {
    const {content}=req.body;
    const comment=await Comment.create({
        content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })

    return res.status(201).json({
        success:true,
        message:"Comment added Succesfully",
    })
    } catch (error) {
        return next(error);
    }
}


export const getMyBlogs = async (req, res, next) => {
  try {
    const id = req.user._id;

    const blogs = await Blog.find({ createdBy: id }).populate("createdBy");

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }
    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

