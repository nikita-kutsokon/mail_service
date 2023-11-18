import { Request, Response, NextFunction } from 'express';

const ExceptionInterceptor = (handler: (req: Request, res: Response, next: NextFunction) => any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default ExceptionInterceptor;