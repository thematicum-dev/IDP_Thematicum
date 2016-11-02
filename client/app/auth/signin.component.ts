import { Component } from '@angular/core';
import {User} from "../models/user";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-signin',
    templateUrl: 'signin.component.html'
})
export class SigninComponent {
    user: User;

    onSubmit(form: NgForm) {
    }
}