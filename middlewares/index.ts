import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/users';

export function authenticate(req:Request,res:Response,next:NextFunction){
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const token = authHeader.split(' ')[1];

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