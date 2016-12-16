import {Component, OnInit} from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";
import {ErrorService} from "./error.service";

@Component({
    selector: 'app-error',
    templateUrl: 'error.component.html'
})
export class ErrorComponent implements  OnInit {
    // @Input() error: Error;
    error: Error;
    isDisplayed: boolean = false;

    constructor(private  errorService: ErrorService) {}

    ngOnInit(): void {
        this.errorService.errorOccurred.subscribe(
            (error: Error) => {
                this.error = error;
                //show error
                this.isDisplayed = true;
            }
        )
    }
}