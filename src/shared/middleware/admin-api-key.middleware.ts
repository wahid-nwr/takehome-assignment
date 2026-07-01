import { NextFunction, Request, Response } from "express";

export class AdminApiKeyMiddleware {
    authenticate(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.header("Authorization");

        console.log("SERVICE_API_KEY:", process.env.SERVICE_API_KEY);
        console.log("Authorization:", req.header("Authorization"));
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Missing or invalid Authorization header."
            });
            return;
        }

        const apiKey = authHeader.substring("Bearer ".length);

        if (apiKey !== process.env.SERVICE_API_KEY) {
            res.status(401).json({
                message: "Invalid service API key."
            });
            return;
        }

        next();
    }
}