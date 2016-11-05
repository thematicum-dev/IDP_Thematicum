import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html'
})
export class SigninComponent {
    user: User;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        const user = new User(form.value.email, form.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    //store the token in the local storage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('username', data.username);
                    this.router.navigateByUrl('/');
                },
                error => console.log(error)
            );
    }
}