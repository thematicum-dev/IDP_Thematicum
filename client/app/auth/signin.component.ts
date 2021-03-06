import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {CaptchaComponent} from "./captcha.component";

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SigninComponent implements AfterViewInit, OnDestroy {
    user: UserModel = new UserModel();
	captcha: CaptchaComponent = new CaptchaComponent('captcha_signin');
    constructor(private authService: AuthService) {}


    ngAfterViewInit(){
		
		this.captcha.render();
		    
    }

    onSubmit(form: NgForm) {
		var response = this.captcha.getResponse();
			this.authService.signin(this.user, response).subscribe(data => {
			this.captcha.reset();
     	},
	err => {
		form.reset();
		this.captcha.reset();
	});
	}

	ngOnDestroy(){
		this.captcha.reset();
	}
}