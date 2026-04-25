import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../utils/jwt';
import { AuthUser } from '../../types';
import { Request } from 'express';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyAccessToken(token as string);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        
        req.user = decoded as AuthUser;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Failed to authenticate token' });
    }
};

