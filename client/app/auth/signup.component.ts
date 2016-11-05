import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html'
})
export class SignupComponent {
    personalRoles = [
        'Financial professional (buy side)',
        'Financial professional (sell side)',
        'Financial professional (independent)',
        'Private investor',
        'Other'
    ];

    selectedPersonalRole = this.personalRoles[0]; //default value

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        //or selectedPersonalRole as last argument
        const user = new User(form.value.name, form.value.email, form.value.password, form.value.personalRole);

        this.authService.signup(user)
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigateByUrl('/signin');
                },
                error => console.log(error)
            );
    }

}