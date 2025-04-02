import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import User from "../models/User";

const userSchema=Joi.object({
    firstName:Joi.string().alphanum().required().min(3)
    .messages({
        "string.min":"first name can not go below 3 characters",
        "string.alphanum":"first name cannot include special characters",
        "string.required":"first name is required"
    }),
    lastName:Joi.string().alphanum().min(3).required()
    .messages({
        "string.min":"Last name can not go below 3 characters",
        "string.alphanum":"first name cannot include special characters",
        "string.required":"Last name is required"
    }),
    userName: Joi.string().alphanum().required().min(3).max(40)
    .messages({
        "string.alphanum":"Username can not contain special characters",
        "string.required":"Username is required",
        "string.min":"Username can not go below 3 characters",
        "string.max":"Username can not exceed 40 characters"
    }),

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required()
    .messages({
        "string.required":"Email is required!",
        "string.email":"Please enter a valid Email"
    }),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .messages({
        "string.required":"Password is required",
        "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
    }),
    phone: Joi.string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Please enter a valid phone number in international format starting with '+' with country code",
      "any.required": "Phone number is required",
    }),
})


export async function validateUser(req:Request,res:Response,next:NextFunction) {
    const {error}=userSchema.validate(req.body,{abortEarly:false})

    if (error){
        return res.status(400).json({
            status:"fail",
            messages:error.details
        })
    }
    const existingUserByEmail=await User.findOne({where:{email:req.body.email}})

    if(existingUserByEmail){
     return res.status(400).json({message:"User already exists! USe another email"})
    }

    const existingUserByUserName=await User.findOne({where:{userName:req.body.userName}})

    if(existingUserByUserName){
     return res.status(400).json({message:"Username already taken pick another one!"})
    }


    next();
}

const loginValidation=Joi.object({
    userName:Joi.string().required()
    .messages({
        "string.required":"Please enter your email",
    }),
    password:Joi.string().required()
    .messages({
        "string.required":"Password is required"
    })
})

export async function validateUserLogin(req:Request,res:Response,next:NextFunction) {
    const {error}=loginValidation.validate(req.body,{abortEarly:false})
    if(error){
        return res.status(400).json({
            status:"fail",
            message:error.details
        })
    }
    next();
}

const verifyEmail=Joi.object({

})

const resetPassword=Joi.object({
    newPassword:Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .messages({
        "string.required":"Password is required",
        "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
    }),
    confirmPassword:Joi.string().required().messages({
        "string.required":"Please confirm your Password"
    })
})

export async function validateResetPassword(req:Request,res:Response,next:NextFunction){
    const {error}=resetPassword.validate(req.body,{abortEarly:false});

    if(error){
       return res.status(400).json({
            status:"fail",
            message:error.details
        })
    }

    next();
}

const updatedPassword=Joi.object({
    newPassword:Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .messages({
        "string.required":"Password is required",
        "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
    })
})

export async function validateUpdatePassword(req:Request,res:Response,next:NextFunction){
    const {error}=updatedPassword.validate(req.body,{abortEarly:false});

    if(error){
        return res.status(400).json({
            status:"fail",
            message:error.details
        })
    }

    next();
}

const sendResetPasswordEmail=Joi.object({
    email:Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).messages({
        "string.required":"Please enter your email",
        "string.email":"Please enter a valid email"
    })
})

export async function validatesendResetPasswordEmail(req:Request,res:Response,next:NextFunction) {
    const {error}=sendResetPasswordEmail.validate(req.body,{abortEarly:false})
    if(error){
        return res.status(400).json({
            status:"fail",
            message:error.details
        })
    }

    next();
}