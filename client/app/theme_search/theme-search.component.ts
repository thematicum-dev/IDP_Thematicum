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
    pageSizes = [1, 2, 3, 4];
    pageSize = 4;
    constructor(private themeService: ThemeService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        //TODO: refactor - create separate classes to override the 2 cases implementation
        if(this.route.snapshot.queryParams['query']) {
            this.searchTerm = this.route.snapshot.queryParams['query'].trim();
            this.searchThemes(this.searchTerm);
        } else if(this.route.snapshot.queryParams['all'] && this.route.snapshot.queryParams['all'] === 'true') {
            this.searchThemes(null);
        }
    }

    onSelectPageSize(index: number){
        this.pageSize = this.pageSizes[index]; 
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

    updateView(data: any){
        this.themes = data.result;
    }

    searchThemes(searchTerm: any) {
        this.themeService.searchThemes(searchTerm, this.pageSize).subscribe(data => this.updateView(data), error => console.log(error));
    }  
}