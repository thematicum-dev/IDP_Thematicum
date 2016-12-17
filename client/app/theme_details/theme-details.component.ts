import {Component, OnInit, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {timeHorizonValues, maturityValues, categoryValues} from "../theme_creation/themeProperties";
import {NgForm} from "@angular/forms";

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
        text-decoration: none;
        outline:none;
        box-shadow: none;
        border-color: #ccc;
        cursor: default;
    }
    .btn.active {
        background-color: #d9edf7;
    }
    input[type="radio"], input[type="checkbox"] {
        visibility:hidden;
    }
`],
    providers: [ThemeSearchService]
})
export class ThemeDetailsComponent implements OnInit, OnChanges {
    theme: Theme;
    themeProperties: any;
    userThemeInputs: any;
    creationDate: Date;

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    isEditMode: boolean = false;
    yellowColorCode = '#fcf8e3';
    whiteColor = 'white';

    ngOnInit(): void {
        //get theme details and characteristic distribution
        this.route.params
            .switchMap((params: Params) => this.searchService.getThemeById(params['id']))
            .subscribe((themeData: any) => {
                console.log('Data retrieved for this theme')
                console.log(themeData)
                this.theme = themeData.theme;
                this.themeProperties = themeData.properties;
                this.creationDate = new Date(themeData.theme.createdAt);
            });

        //get user's input for the theme
        this.route.params
            .switchMap((params: Params) => this.searchService.getUserInputsPerTheme(params['id']))
            .subscribe((userInputPerTheme: any) => {
                console.log('User input')
                console.log(userInputPerTheme)
                if (userInputPerTheme) this.userThemeInputs = userInputPerTheme.userInputs.themeProperties;
            });

    }

    ngOnChanges(changes: SimpleChanges): void {
        var themeChange: Theme = changes.theme.currentValue;
        if (themeChange) {
            // this.autocompleteList.list = this.dataSource;
            // console.log(this.theme)
        }
    }

    getPropertyVoteDistributionStr(percentage: number, nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `${percentage}% (${nrUsers} user${trailingS})`;
    }

    constructor(private elementRef: ElementRef, private route: ActivatedRoute, private router: Router, private searchService: ThemeSearchService) { }

    toggleEditMode(containerDiv: Element) {
        this.isEditMode = !this.isEditMode;

        let labels = containerDiv.querySelectorAll('label.active');
        for (let i = 0; i<labels.length; i++) {
            labels[i].classList.remove('active');
        }
    }

    setPropertyBackgroundColor(propertyName, index) {
        if (this.isEditMode) {
            return
        }

        if (!this.isEditMode && !this.userThemeInputs) {
            return this.whiteColor;
        }

        if (propertyName == "categories") {
            return this.userThemeInputs[propertyName].indexOf(index) < 0 ? this.whiteColor : this.yellowColorCode;
        } else {
            return this.userThemeInputs[propertyName] != index ? this.whiteColor : this.yellowColorCode;
        }
    }

    setDataToggleAttribute() {
        return this.isEditMode ? 'buttons' : '';
    }



    // onSubmit(timeHorizonDiv, form) {
    //
    // }
}