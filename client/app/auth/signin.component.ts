import { Component, AfterViewInit } from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";

declare var grecaptcha: any;

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class SigninComponent implements AfterViewInit {
    user: UserModel = new UserModel();
    constructor(private authService: AuthService) {}

    ngAfterViewInit(){
	    if (window['grecaptcha'] == undefined){
		   window.onload =function(){
			grecaptcha.render(document.getElementById('captcha_signin'),{
		    		'sitekey':'6LerPh4UAAAAAL6-PPaN6-w2JX4wcJSjkQp2MAxl'
			});
		   }
	    }else{
		   grecaptcha.render(document.getElementById('captcha_signin'),{
		    		'sitekey':'6LerPh4UAAAAAL6-PPaN6-w2JX4wcJSjkQp2MAxl'
		});
	    }
    }

    onReset(){
	    console.log("form getting reset");
	    window['grecaptcha'].reset('captcha_signin');
    }

    onSubmit(form: NgForm) {
	this.authService.captcha_check(window['grecaptcha'].getResponse()).subscribe(data => {
	         var obj = JSON.parse(data);
	         if(obj.success == true){
			 this.authService.signin(this.user).subscribe(data => {
			//store auth data in local storage
			localStorage.setItem('token', data.token);
			localStorage.setItem('username', data.username);
		},
		error => form.reset());
	         }else{
			throw Error("Captcha not correct");
	         }
        }, error => form.reset());
    }
}