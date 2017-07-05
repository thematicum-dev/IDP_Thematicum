import { Component, AfterViewInit } from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {CaptchaComponent} from "./captcha.component";

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SigninComponent implements AfterViewInit {
    user: UserModel = new UserModel();
    captcha: CaptchaComponent = new CaptchaComponent('captcha_signin');
    constructor(private authService: AuthService) {}

    ngAfterViewInit(){
	    this.captcha.render();	    
    }

    onSubmit(form: NgForm) {
	this.authService.signin(this.user, this.captcha.getResponse()).subscribe(data => {
		//store auth data in local storage
		localStorage.setItem('token', data.token);
		localStorage.setItem('username', data.username);
		localStorage.setItem('email', data.email);
		localStorage.setItem('isAdmin', data.isAdmin);
     	},
	error => {
		console.log("got an error");
		form.reset();
		this.captcha.reset();
	});
    }
}