import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import {Router, ActivatedRoute} from "@angular/router";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html'
})
export class ThemeSearchComponent implements OnInit {
    searchTerm = "";
    themes: Theme[] = [];

    constructor(private themeService: ThemeService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        //TODO: refactor - create separate classes to override the 2 cases implementation
        if(this.route.snapshot.queryParams['query']) {
            this.searchTerm = this.route.snapshot.queryParams['query'].trim();
            this.searchThemes(this.searchTerm);
        }
        if(this.route.snapshot.queryParams['all'] && this.route.snapshot.queryParams['all'] === 'true') {
            this.searchThemes(null);
        }
    }

    onSubmit(form: NgForm) {
        if(this.searchTerm) {
            this.router.navigate([], {queryParams:{query: this.searchTerm}});
            this.searchThemes(this.searchTerm);
        } else {
            this.router.navigate([], {queryParams:{all: 'true'}});
            this.searchThemes(null);
        }
    }

    goToThemeDetails(themeId: string) {
        this.router.navigate(['/theme', themeId]);
    }

    searchThemes(searchTerm: any) {
        this.themeService.searchThemes(searchTerm).subscribe(data => this.themes = data, error => console.log(error));
    }
}