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
    //TODO: fetch personal roles from backend
    personalRoles = [
        'Financial professional (buy side)',
        'Financial professional (sell side)',
        'Financial professional (independent)',
        'Private investor',
        'Other'
    ];

    selectedPersonalRole = this.personalRoles[0]; //default value
    registrationAccessCode: String = "";

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        //or selectedPersonalRole as last argument
        const user = new User(form.value.email, form.value.password, form.value.name, form.value.personalRole);
        const signupModel = new SignupModel(user, form.value.accessCode);

        this.resetForm(form);

        this.authService.signup(signupModel)
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigateByUrl('/signin');
                },
                error =>  {
                    //console.log(error)
                }
            );
    }

    resetForm(form: NgForm) {
        form.reset();
        this.selectedPersonalRole = this.personalRoles[0];
    }

}