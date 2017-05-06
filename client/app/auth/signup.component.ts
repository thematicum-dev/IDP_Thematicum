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

    ngAfterViewInit(){
	    this.captcha.render();
    }


    onSubmit(form: NgForm) {
        const signupModel = new SignupModel(this.user, this.registrationAccessCode);

        this.authService.captcha_check(window['grecaptcha'].getResponse()).subscribe(data => {
	         var obj = JSON.parse(data);
	         if(obj.success == true){
			 this.authService.signup(signupModel).subscribe(data => this.router.navigateByUrl('/signin'), error => {
				 form.reset();
			 	this.captcha.reset();
			 });
	         }else{
			throw Error("Captcha not correct");
	         }
        }, error => form.reset());
    }
}