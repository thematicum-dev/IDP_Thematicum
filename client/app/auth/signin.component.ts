import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SigninComponent {
    user: User = new User();
    constructor(private authService: AuthService) {}

    onSubmit(form: NgForm) {
        this.authService.signin(this.user).subscribe(data => {
            //store auth data in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
        },
        error => form.reset());
    }
}