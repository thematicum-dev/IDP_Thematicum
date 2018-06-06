import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {CaptchaComponent} from "./captcha.component";

@Component({
    selector: 'app-forgot',
    templateUrl: 'forgot.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class ForgotComponent implements AfterViewInit, OnDestroy {
    user: UserModel = new UserModel();
    constructor(private authService: AuthService) {}


    ngAfterViewInit(){
		
		    
    }

    onSubmit(form: NgForm) {
			this.authService.forgot(this.user).subscribe(data => {
			
     	},
	err => {
		form.reset();
	});
	}

	ngOnDestroy(){
	}
}