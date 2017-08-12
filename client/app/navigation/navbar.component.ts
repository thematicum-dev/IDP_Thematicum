import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router, NavigationStart } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit {
    loggedIn: boolean = false;
    homePage: boolean = true;

    constructor(private authService: AuthService, private _router: Router) {
        this._router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.routeChange(event);
            }
        })
    }
    
    ngOnInit(): void {
        this.authService.isLoggedIn().subscribe((value: boolean) => {
            this.loggedIn = value;
        })
    }

    routeChange(event: NavigationStart){
        if(event.url == "/home" || event.url == "/"){
            this.homePage = true;
        } else {
            this.homePage = false;
        }
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