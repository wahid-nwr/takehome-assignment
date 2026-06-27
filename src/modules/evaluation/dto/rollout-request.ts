import { EvaluationRequest } from "../evaluation-request";
import { EvaluatableFlag } from "../models/evaluatable-flag";

export interface RolloutRequest extends EvaluationRequest {
    flags: EvaluatableFlag[];
}