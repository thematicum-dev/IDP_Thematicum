import {EventEmitter} from "@angular/core";
import {Error} from './error';

export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    handleError(error: any) {
        //TODO: error format consistency
        const errorData = new Error(error.title, error.error.message);
        this.errorOccurred.emit(errorData);
    }
}