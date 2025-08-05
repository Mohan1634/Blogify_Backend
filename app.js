import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middlewares/error.js";
import blogRoute from "./routes/blog.js";
import userRoute from "./routes/user.js";


export const app = express();

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}));

//using Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


//using Routes
app.use("/api/v1/users",userRoute);
app.use("/api/v1/blog",blogRoute);
app.get("/",async (req,res)=>{
    return res.send("Nice Working");
})

//using ErrorMiddleware
app.use(errorMiddleWare);




