import { Component } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
    loggedInUser: String;

    constructor(private authService: AuthService) {
        this.loggedInUser = authService.getLoggedInUser();
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    onLogoutClick() {
        this.authService.logout();
    }
}