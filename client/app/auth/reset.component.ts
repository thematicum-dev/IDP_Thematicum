import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserModel} from "../models/userModel";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-reset',
    templateUrl: 'reset.component.html',
    styleUrls: [`.well { padding-top: 0px}`]
})
export class ResetComponent implements  OnDestroy {
    user: UserModel = new UserModel();
    constructor(private authService: AuthService , private route: ActivatedRoute, private router: Router) {}
    reenterPassword: string = "";
   


    doPasswordsMatch(){
        return this.reenterPassword == this.user.password;
    }

    onSubmit(form: NgForm) {

            this.authService.reset(this.user,this.route.snapshot.params['token']).subscribe(data => {
            
        },
    err => {
        form.reset();
    });
    }

    ngOnDestroy(){
    }
}