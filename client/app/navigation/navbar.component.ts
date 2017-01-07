import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit {
    //isLoggedIn: boolean;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.isLoggedIn().subscribe((value: boolean) => {
            //this.isLoggedIn = value;
        })
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    onLogoutClick() {
        this.authService.logout();
    }

    getLoggedInUser() {
        return this.authService.getLoggedInUser();
    }
}