import { Component, AfterViewInit} from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {SignupModel} from "./signup-model";
import { Http,Headers } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {CaptchaComponent} from "./captcha.component";

@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SignupComponent implements AfterViewInit{
    user: UserModel = new UserModel();
    captcha: CaptchaComponent = new CaptchaComponent('captcha_signup');
    registrationAccessCode: string;
    subscriptionSelected: boolean = false;
    personalRoles = [
        'Financial professional (buy side)',
        'Financial professional (sell side)',
        'Financial professional (independent)',
        'Private investor',
        'Other'
    ];
    reenterPassword: string = "";

    constructor(private authService: AuthService, private router: Router) {
        this.user.personalRole = this.personalRoles[0]; //default value
    }

    ngAfterViewInit(){
	    this.captcha.render();
    }

    doPasswordsMatch(){
        return this.reenterPassword == this.user.password;
    }

    onSubmit(form: NgForm) {

    	this.subscriptionSelected = form.controls['subscribe'].value;

    	console.log("subscription selected?" + this.subscriptionSelected);

        const signupModel = new SignupModel(this.user, this.registrationAccessCode, this.subscriptionSelected);
        this.authService.signup(signupModel, this.captcha.getResponse()).subscribe(data => {
            this.router.navigateByUrl('/signin')
            this.captcha.reset();
        },
        err => {
            form.reset();
            this.captcha.reset();
        	});
    }
}