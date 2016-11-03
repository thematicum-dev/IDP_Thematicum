import { Component } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
    loggedInUser: User;

    constructor(private authService: AuthService) {

    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    onLogoutClick() {
        this.authService.logout();
    }
}