import { Component } from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'app-error',
    templateUrl: 'error.component.html'
})
export class ErrorComponent {
    @Input() error: Error;
}