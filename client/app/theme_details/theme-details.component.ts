import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {timeHorizonValues, maturityValues, categoryValues} from "../theme_creation/themeProperties";

@Component({
    selector: 'app-theme-details',
    templateUrl: 'theme-details.component.html',
    styles: [`h3 {
        margin-top: 0;
    }
    .default-cursor {
        cursor: default;
    }
    button.no-decoration-element, label.no-decoration-element:hover, label.no-decoration-element:focus {
        background-color: white;
        text-decoration: none;
        outline:none;
        border: none;
        box-shadow: none;
    }
    hr {
        margin-top: 0;
    }
    label.inactive-element:hover, label.inactive-element:not(:hover), label.inactive-element:focus {
        background-color: white;
        text-decoration: none;
        outline:none;
        box-shadow: none;
        border-color: #ccc;
        cursor: default;
    }
`],
    providers: [ThemeSearchService]
})
export class ThemeDetailsComponent implements OnInit, OnChanges {
    theme: Theme;
    themeProperties: any;
    creationDate: Date;

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    isEditMode: boolean = false;

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.searchService.getThemeById(params['id']))
            .subscribe((themeData: any) => {
                console.log('Data retrieved for this theme')
                console.log(themeData)
                this.theme = themeData.theme;
                this.themeProperties = themeData.properties;
                this.creationDate = new Date(themeData.theme.createdAt);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        var themeChange: Theme = changes.theme.currentValue;
        if (themeChange) {
            // this.autocompleteList.list = this.dataSource;
            // console.log(this.theme)
        }
    }

    test($event: Event) {
        if (!this.isEditMode) {
            return false;
        }
    }

    getPropertyVoteDistributionStr(percentage: number, nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `${percentage}% (${nrUsers} user${trailingS})`;
    }

    constructor(private route: ActivatedRoute, private router: Router, private searchService: ThemeSearchService) { }
}