import {Component} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'app-homepage',
    templateUrl: 'homepage.component.html'
})
export class HomepageComponent {
    title = "Thematic risk research";
    constructor(private authService: AuthService) {}
    
    isLoggedIn() {
        return this.authService.getStoredToken() != null;
    }
}