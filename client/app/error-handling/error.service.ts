import {EventEmitter} from "@angular/core";
import {Error} from './error';

export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    handleError(error: any) {
        //TODO: error format consistency
        if (error.error.name === "ValidationError" && error.error.errors) {
            var validationErrorMessages = [];
            Object.entries(error.error.errors).forEach(
                ([key, value]) => {
                    validationErrorMessages.push(value.message)
                }
            );
            this.errorOccurred.emit(new Error(validationErrorMessages));
        } else {
            this.errorOccurred.emit(new Error([error.error .message || error.title]));
        }
    }
}