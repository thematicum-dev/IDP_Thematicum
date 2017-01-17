import {Component, OnInit} from '@angular/core';
import {ThemeSearchService} from "../theme_search/theme-search.service";
import {ThemeService} from "../theme_creation/theme.service";
@Component({
    selector: 'app-theme-properties',
    templateUrl: 'theme-properties.component.html'
})
export class ThemePropertiesComponent implements OnInit {
    selectedThemeId = '5845b34f2af1246f884efdd9';
    themePropertiesAggregation: any;
    constructor(
        private searchService: ThemeSearchService,
        private themeService: ThemeService) { }

    ngOnInit(): void {
        this.searchService.getThemeProperties(this.selectedThemeId).subscribe(
            data => {
                this.themePropertiesAggregation = data.properties;
                console.log('Properties: ', this.themePropertiesAggregation)
            },
            error => {
                console.log('Error getting theme properties: ', error);
            }
        );
    }
}