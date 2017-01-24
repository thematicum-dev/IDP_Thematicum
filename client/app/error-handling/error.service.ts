import {EventEmitter, Injectable} from "@angular/core";
import {Error} from './error';
import {Router} from "@angular/router";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    constructor(private router: Router) {}

    public handleError (error: Response | any) {
        let errorJson = error.json();
        var errMsg = errorJson.message ? errorJson.message : 'An error occurred';

        console.log('errJson: ', errorJson);
        if (error.status == 401) {
            this.router.navigate(['/signin']);
            this.errorOccurred.emit(new Error([errMsg]));
        } else if (error.status == 500) {
            //check for validation messages
            if(errorJson.errors) {
                this.errorOccurred.emit(this.getValidationError(errorJson.errors));
            } else {
                this.errorOccurred.emit(new Error([errMsg]));
            }
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