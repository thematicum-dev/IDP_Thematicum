import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html'
})
export class SignupComponent {
    user: User;
    personalRoles = [
        'Financial professional (buy side)',
        'Financial professional (sell side)',
        'Financial professional (independent)',
        'Private investor',
        'Other'
    ];

    constructor(private authService: AuthService) {}

    onSubmit(form: NgForm) {
        const user = new User(form.value.name, form.value.email, form.value.password, form.value.personalRole);
        this.authService.signup(user)
            .subscribe(
                data => console.log(data),
                error => console.log(error)
            )
    }
}