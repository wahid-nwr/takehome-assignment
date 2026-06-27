import { AppError } from "./app.error";

export class ValidationError extends AppError {

constructor(
        message = "Validation"
    ) {
        super(409, message);
    }

}