import {EventEmitter, Injectable} from "@angular/core";
import {Error} from './error';
import {Router} from "@angular/router";

@Injectable()
export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    constructor(private router: Router) {}

    handleError(errorResponse: any) {
        //TODO: error format consistency
        //TODO: pass whole Response object to handleError
        console.log('At ErrorService')
        let errorJson = errorResponse.json();

        if (errorResponse.status == 401) {
            //unauthorized error
            this.errorOccurred.emit(new Error([errorJson.error.message || errorJson.title]));

            //TODO: maybe check active route url; if in 'signin' don't redirect
            this.router.navigate(['/signin']);
        } else if (errorResponse.status == 500 && errorJson.error.name === "ValidationError" && errorJson.error.errors) {
            //check if Mongoose validation error
            console.log('ErrorService - getting validation error messages')

            //do not navigate, remain on same page
            this.errorOccurred.emit(this.getValidationError(errorJson.error.errors));
        } else {
            //other error types: 403, 404, 500 etc.
            console.log('General error, Status:', errorResponse.status)
            this.router.navigate(['/error', errorResponse.status]);
        }
    }

    getValidationError(errors: any): Error {
        var validationErrorMessages = [];
        Object.entries(errors).forEach(
            ([key, value]) => {
                validationErrorMessages.push(value.message)
            }
        );

        return new Error(validationErrorMessages);
    }

}