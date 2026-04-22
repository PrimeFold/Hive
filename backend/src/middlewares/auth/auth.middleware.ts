import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthUser } from '../../types';

export const AuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; 

        
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);

        if(typeof decoded =='string'){
            return res.status(401).json({
                message:"Invalid token"
            })
        }
        
        req.user = decoded as AuthUser;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Failed to authenticate token' });
    }
};

