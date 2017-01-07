import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-error-page',
    templateUrl: 'error-page.component.html'
})

export class ErrorPageComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}
    errorMessage: string = 'Error';

    errorMessages = {
        401: 'Authentication Required',
        403: 'Forbidden',
        404: 'Not found',
        500: 'Internal server error'
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            console.log(+params['errorMsg']);
            this.errorMessage = this.errorMessages[params['errorMsg']] || 'Error';

        });
    }
}