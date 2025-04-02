import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/users';
import User, { UserAttributes } from '../models/User';

export function authenticate(req:Request,res:Response,next:NextFunction){
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith('Bearer ')){
           return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const token = authHeader!.split(' ')[1];

        const decoded=verifyToken(token);

        req.user=decoded;
        next();
    }
    catch(error){
        return res.status(401).json({ message: 'Invalid token.' });

    }
}

export function getTokenFromBrowser(req:Request,res:Response,next:NextFunction){
    try{
        const token =req.query.token as string;

        const decoded=verifyToken(token);

        req.user=decoded;
        next();
    }
    catch(error){
        return res.status(401).json({ message: 'Invalid token.' });

    }
}

export async function getUser(req:Request,res:Response,next:NextFunction){
    try{
        const userId=(req.user as UserAttributes).id
        const user= await User.findByPk(userId)

        if(!user){
            return res.status(400).json({message:"User is not found"});
        }
        req.user=user;
        next()
    }
    catch(error){
        return res.status(401).json({error:error})
    }
}

export async function adminAuthenticate (req:Request,res:Response,next:NextFunction){
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith('Bearer ')){
           return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const token = authHeader!.split(' ')[1];

        const decoded=verifyToken(token) as any;

        console.log(decoded)

        if (decoded.user.role !== 'admin') { 
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        req.user=decoded;
        next();
    }
    catch(error){
        return res.status(401).json({ message: 'Invalid token.' });

    }
}