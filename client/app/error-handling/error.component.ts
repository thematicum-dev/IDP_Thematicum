import {Component, OnInit} from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";
import {ErrorService} from "./error.service";
import {Error} from './error';

@Component({
    selector: 'app-error',
    templateUrl: 'error.component.html'
})
export class ErrorComponent implements  OnInit {
    error: Error = null;

    constructor(private  errorService: ErrorService) {}

    ngOnInit(): void {
        this.errorService.errorOccurred.subscribe(
            (error: Error) => {
                this.error = error;
            }
        )
    }
}