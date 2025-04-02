import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import User, { userCreationAttribute } from '../models/User';
import bcrypt from "bcrypt"
import { NextFunction, Request } from 'express';
import nodemailer from "nodemailer"
import { generateEmailTemplate } from '../information/userInfo';

dotenv.config();

const senderEmail=process.env.EMAIL_USER
const senderPassword=process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

export async function generateJwtToken(user:userCreationAttribute,id:string){
    const token= jwt.sign(
        {
            user:user,id
        },
        process.env.JWT_SECRET || "Secret",
        { expiresIn: '24h' } 
    )
    return token
}

export  function verifyToken(token:string){
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET||"Secret");
        return decoded
      } catch (error) {
        console.error('Invalid token:', error);
      }
}

export async function hashPassword(password:string) {
    const saltRounds=process.env.SALT_ROUNDS||10
    return await bcrypt.hash(password,saltRounds)
}

export async function comparePassword(inputPassword:string,outputPassword:string){
    return await bcrypt.compare(
        inputPassword,     
        outputPassword     
      );
}

export async function sendEmail(body:string,link:string,buttonInfo:string,username:string,email:string,subject:string){
    try{
        const info = await transporter.sendMail({
            from: senderEmail,
            to: email, 
            subject:subject,
            html: generateEmailTemplate(subject,body,buttonInfo,link,username), 
          });
          return info
    }
    catch(error){
        return error
    }
}

export async function getUserById(id:string) {
    return await User.findByPk(id)
}

export async function getUserByEmail(email:string) {
    return await User.findOne({where:{email:email}})
}