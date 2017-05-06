import { Component, AfterViewInit} from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {SignupModel} from "./signup-model";
import { Http,Headers } from '@angular/http';
import {Observable} from 'rxjs/Rx';

declare var grecaptcha: any;

@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SignupComponent implements AfterViewInit{
    user: UserModel = new UserModel();
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
	    if (window['grecaptcha'] == undefined){
		   window.onload =function(){
			grecaptcha.render(document.getElementById('captcha_signup'),{
		    		'sitekey':'6LerPh4UAAAAAL6-PPaN6-w2JX4wcJSjkQp2MAxl'
			});
		   }
	    }else{
		   grecaptcha.render(document.getElementById('captcha_signup'),{
		    		'sitekey':'6LerPh4UAAAAAL6-PPaN6-w2JX4wcJSjkQp2MAxl'
		});
	    }
    }

    onReset(){
	    window['grecaptcha'].reset('captcha_signup');
    }

    onSubmit(form: NgForm) {
        const signupModel = new SignupModel(this.user, this.registrationAccessCode);

        this.authService.captcha_check(window['grecaptcha'].getResponse()).subscribe(data => {
	         var obj = JSON.parse(data);
	         if(obj.success == true){
			 this.authService.signup(signupModel).subscribe(data => this.router.navigateByUrl('/signin'), error => form.reset());
	         }else{
			throw Error("Captcha not correct");
	         }
        }, error => form.reset());
    }
}