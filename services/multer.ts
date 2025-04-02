import { Request } from "express";
import multer from "multer";
import path from "path";

 export const uploadManyFiles=multer({
    storage:multer.diskStorage({}),
    fileFilter:(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
        let ext=path.extname(file.originalname);
        if(ext!=='.jpg' && ext!==".jpeg" && ext!==".png" && ext!==".mp4" && ext!==".mov" &&  ext!==".avi"){
            cb(new Error("File type is not supported"));
            return
        }
        cb(null,true);
    }
}).array('files',8);

export const uploadSingleFile=multer({
    storage:multer.diskStorage({}),
    fileFilter:(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
        let ext=path.extname(file.originalname);
        if(ext!=='.jpg' && ext!==".jpeg" && ext!==".png"){
            cb(new Error("File type is not supported"));
            return
        }
        cb(null,true);
    }
}).array('image',8);


