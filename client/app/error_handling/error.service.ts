import {EventEmitter, Injectable} from "@angular/core";
import {Error} from './error';
import {Router} from "@angular/router";
import {Response} from "@angular/http";

@Injectable()
export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    constructor(private router: Router) {}

    public handleError (error: Response | any) {
        let errorJson = error.json();
        let errMsg = errorJson.message ? errorJson.message : 'An error occurred';

        if (error.status == 401) {
            localStorage.clear();
            this.router.navigate(['/signin']);
            this.errorOccurred.emit(new Error([errMsg]));
        } else if (error.status == 500 && errorJson.errors) {
            //check for validation messages
            this.errorOccurred.emit(this.getValidationError(errorJson.errors));
        } else {
            this.errorOccurred.emit(new Error([errMsg]));
        }
    }

    getValidationError(errors: any): Error {
        let validationErrorMessages = [];
        Object.entries(errors).forEach(
            ([key, value]) => {
                validationErrorMessages.push(value.message)
            }
        );

        return new Error(validationErrorMessages);
    }
}