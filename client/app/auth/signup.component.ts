import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {SignupModel} from "./signup-model";

@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SignupComponent {
    user: User = new User();
    registrationAccessCode: string;
    personalRoles = [
        'Financial professional (buy side)',
        'Financial professional (sell side)',
        'Financial professional (independent)',
        'Private investor',
        'Other'
    ];

    constructor(private authService: AuthService, private router: Router) {
        this.user.personalRole = this.personalRoles[0]; //default value
    }

    onSubmit(form: NgForm) {
        const signupModel = new SignupModel(this.user, this.registrationAccessCode);

        this.authService.signup(signupModel).subscribe(data => this.router.navigateByUrl('/signin'), error => form.reset());
    }
}