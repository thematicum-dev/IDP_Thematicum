import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'app-homepage',
    templateUrl: 'homepage.component.html'
})
export class HomepageComponent implements OnInit  {
    title = "Thematicum";
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
      
    }

    isLoggedIn() {
        return this.authService.getStoredToken() != null;
    }
}