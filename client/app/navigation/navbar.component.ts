import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit {
    loggedIn: boolean = false;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.isLoggedIn().subscribe((value: boolean) => {
            this.loggedIn = value;
        })
    }

    isLoggedIn() {
        return this.authService.getStoredToken() != null;
    }

    onLogoutClick() {
        this.authService.logout();
    }

    getLoggedInUser() {
        return this.authService.getLoggedInUser();
    }
}