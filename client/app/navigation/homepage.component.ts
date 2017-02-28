import {Component} from '@angular/core';
@Component({
    selector: 'app-homepage',
    templateUrl: 'homepage.component.html'
})
export class HomepageComponent {
    title = "Welcome";
    subtitle = "Thematicum";

    constructor() {
        console.log('local host: ');
        console.log(process.env);
    }
}