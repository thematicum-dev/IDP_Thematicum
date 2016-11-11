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
        this.searchService.searchThemes(this.searchTerm.trim())
            .subscribe(
                data => {
                    //store the token in the local storage
                    console.log(data.obj);
                },
                error => {
                    console.log(error)
                }
            );
    }
}