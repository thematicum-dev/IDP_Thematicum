import { Component } from '@angular/core';
import {ThemeSearchService} from "./theme-search.service";
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import {AutoCompleteComponent} from "../autocomplete/autocomplete.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html',
    providers: [ThemeSearchService]
})
export class ThemeSearchComponent {
    searchTerm = "";
    themes: Theme[] = [];

    constructor(private searchService: ThemeSearchService, private router: Router) {}

    onSubmit(form: NgForm) {
        this.searchService.searchThemes(this.searchTerm.trim())
            .subscribe(
                data => {
                    this.themes = [];
                    for (var i = 0; i < data.length; i++) {
                        this.themes.push(new Theme(
                            data[i]._id,
                            data[i].name,
                            data[i].description));
                    }
                },
                error => {
                    console.log(error)
                }
            );
    }

    goToThemeDetails(themeId: string) {
        this.router.navigate(['/theme', themeId]);
    }
}