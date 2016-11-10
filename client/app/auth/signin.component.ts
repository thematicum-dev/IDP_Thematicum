import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {ErrorComponent} from "../error-handling/error.component";

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html',
    directives: [ErrorComponent]
})
export class SigninComponent {
    user: User;
    error: Error;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        const user = new User(form.value.email, form.value.password);

        //reset form
        this.resetForm(form);

        this.authService.signin(user)
            .subscribe(
                data => {
                    //store the token in the local storage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('username', data.username);
                    this.router.navigateByUrl('/');
                },
                error => {
                    console.log(error)
                    this.error = error;
                }
            );
    }

    resetForm(form: NgForm) {
        form.reset();
    }
}