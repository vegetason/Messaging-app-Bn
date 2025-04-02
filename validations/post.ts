import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import Post from "../models/Post";

const postSchema=Joi.object({
    title:Joi.string().required().min(3)
    .messages({
        "string.min":"Title can not go below 3 characters",
        "string.required":"Title is required"
    }),
    description: Joi.string().required().min(3).max(40)
    .messages({
        "string.required":"description is required",
    }),
})


export async function validatePost(req:Request,res:Response,next:NextFunction) {
    const {error}=postSchema.validate(req.body,{abortEarly:false})

    if (error){
        return res.status(400).json({
            status:"fail",
            messages:error.details
        })
    }

    next();
}