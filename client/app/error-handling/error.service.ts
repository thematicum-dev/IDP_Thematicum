import {EventEmitter, Injectable} from "@angular/core";
import {Error} from './error';
import {Router} from "@angular/router";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    constructor(private router: Router) {}

    // handleError(errorResponse: any) {
    //     //TODO: error format consistency
    //     //TODO: pass whole Response object to handleError
    //     console.log('At ErrorService')
    //     let errorJson = errorResponse.json();
    //
    //     if (errorResponse.status == 401) {
    //         //unauthorized error
    //         this.errorOccurred.emit(new Error([errorJson.error.message || errorJson.title]));
    //
    //         //TODO: maybe check active route url; if in 'signin' don't redirect
    //         this.router.navigate(['/signin']);
    //     } else if (errorResponse.status == 500 && errorJson.error.name === "ValidationError" && errorJson.error.errors) {
    //         //check if Mongoose validation error
    //         console.log('ErrorService - getting validation error messages')
    //
    //         //do not navigate, remain on same page
    //         this.errorOccurred.emit(this.getValidationError(errorJson.error.errors));
    //     } else {
    //         //other error types: 403, 404, 500 etc.
    //         console.log('General error, Status:', errorResponse.status)
    //         this.errorOccurred.emit(new Error(['Error']));
    //         //this.router.navigate(['/error', errorResponse.status]);
    //     }
    // }

    public handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        console.log(error)
        console.log('json: ', error.json())
        let errorJson = error.json();
        var errMsg = errorJson.title ? `${errorJson.title}.` : '';
        errMsg += errorJson.error && errorJson.error.message ? `${errorJson.error.message}` : '';

        console.log('errMsg: ', errMsg);
        if (error.status == 401) {
            this.router.navigate(['/signin']);
            this.errorOccurred.emit(new Error([errMsg]));
        } else if (error.status == 500) {
            //check for validation messages
            console.log('how about here?')
            if(errorJson.error && errorJson.error.errors) {
                console.log('Check validation errors')
                this.errorOccurred.emit(this.getValidationError(errorJson.error.errors));
            } else {
                console.log('is this issued?')
                this.errorOccurred.emit(new Error([errMsg]));
            }
            //return Observable.throw(errMsg);
        }
        // if (error instanceof Response) {
        //     const body = error.json() || '';
        //     const err = body.error || JSON.stringify(body);
        //     errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
        // } else {
        //     errMsg = error.message ? error.message : error.toString();
        // }
        //console.error(errMsg);
       // this.errorOccurred.emit(new Error([errMsg]));
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