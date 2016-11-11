import { Component } from '@angular/core';
import {ThemeSearchService} from "./theme-search.service";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html',
    providers: [ThemeSearchService],
})
export class ThemeSearchComponent {
    searchTerm = "";

    constructor(private searchService: ThemeSearchService) {}

    onSubmit(form: NgForm) {
        this.authService.signin(user)
            .subscribe(
                data => {
                    //store the token in the local storage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('username', data.username);
                    this.router.navigateByUrl('/');
                },
                error => {
                    console.log(error)
                    this.error = error;
                }
            );
    }
}