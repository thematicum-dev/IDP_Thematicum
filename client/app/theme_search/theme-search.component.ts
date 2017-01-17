import {Component, OnInit} from '@angular/core';
import {ThemeSearchService} from "./theme-search.service";
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import {AutoCompleteComponent} from "../autocomplete/autocomplete.component";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html',
    providers: [ThemeSearchService]
})
export class ThemeSearchComponent implements OnInit {
    searchTerm = "";
    themes: Theme[] = [];

    constructor(private searchService: ThemeSearchService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        if(this.route.snapshot.queryParams['query']) {
            this.searchTerm = this.route.snapshot.queryParams['query'];
            this.searchThemesByQueryParam();
        }
    }

    onSubmit(form: NgForm) {
        this.updateQueryParam();
        this.searchThemesByQueryParam();
    }

    goToThemeDetails(themeId: string) {
        this.router.navigate(['/theme', themeId]);
    }

    updateQueryParam() {
        this.router.navigate([], this.searchTerm ? {queryParams:{query:this.searchTerm}} : {});
        //this.router.navigate([], {queryParams:{query:this.searchTerm}});
    }

    searchThemesByQueryParam() {
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
}