import { Request, Response, NextFunction } from "express";
import { EvaluationService } from "./evaluation.service";

export class EvaluationController {
    constructor(
        private readonly evaluationService: EvaluationService
    ) {}

    evaluate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.evaluationService.evaluate({
                    tenantId: req.tenant!.id,
                    environment: req.body.environment,
                    userId: req.body.userId,
                    context: req.body.context
                });

            res.json(result);

        } catch (error) {
            next(error);
        }
    };

    evaluateBulk = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.evaluationService.evaluateBulk({
                    tenantId: req.tenant!.id,
                    environment: req.body.environment,
                    userIds: req.body.userIds,
                    context: req.body.context
                });

            res.json(result);

        } catch (error) {
            next(error);
        }
    };
}