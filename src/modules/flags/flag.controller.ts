import { Request, Response, NextFunction } from "express";
import { FlagService } from "./flag.service";
import { Environment } from "@prisma/client";

export class FlagController {

constructor(
        private readonly flagService: FlagService
    ) {}

    createFlag = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const flag = await this.flagService.createFlag(
                req.tenant!.id,
                req.body
            );
            res.status(201).json(flag);
        } catch (err) {
            next(err);
        }
    };

    getFlags = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {

            const flags = await this.flagService.getFlags(
                req.tenant!.id,
                req.query.environment as Environment | undefined
            );

            res.json(flags);

        } catch (err) {
            next(err);
        }
    };

    updateFlag = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {

            const flag = await this.flagService.updateFlag(
                req.tenant!.id,
                req.params.flagKey,
                req.body
            );

            res.json(flag);

        } catch (err) {
            next(err);
        }
    };

    archiveFlag = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {

            await this.flagService.archiveFlag(
                req.tenant!.id,
                req.params.flagKey
            );

            res.status(204).send();

        } catch (err) {
            next(err);
        }
    };
}