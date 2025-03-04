import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import { userCreationAttribute } from '../models/User';
import bcrypt from "bcrypt"

dotenv.config();

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

export async function verifyToken(token:string){
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