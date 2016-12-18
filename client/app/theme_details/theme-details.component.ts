import {Component, OnInit, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";
import {NgForm} from "@angular/forms";
import {ThemeProperties} from "../models/themeProperties";
import {ThemeService} from "../theme_creation/theme.service";

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
    //theme existing data
    theme: Theme;
    themePropertiesAggregation: any;
    userThemeInputs: any;
    userThemeInputsId: any;
    creationDate: Date;

    //theme data - for user editing
    themeProperties: ThemeProperties = new ThemeProperties();

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
                this.themePropertiesAggregation = themeData.properties;
                this.creationDate = new Date(themeData.theme.createdAt);
            });

        //get user's input for the theme
        this.route.params
            .switchMap((params: Params) => this.searchService.getUserInputsPerTheme(params['id']))
            .subscribe((userInputPerTheme: any) => {
                console.log('User input')
                console.log(userInputPerTheme)
                if (userInputPerTheme) {
                    this.userThemeInputsId = userInputPerTheme.userInputs._id;
                    this.userThemeInputs = userInputPerTheme.userInputs.themeProperties;
                }
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

    constructor(
        private elementRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private searchService: ThemeSearchService,
        private themeService: ThemeService) { }

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

        console.log(this.userThemeInputs)
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

    onSubmit(form: NgForm) {
        this.themeProperties.setCheckedCategories();

        /*if there isn't any existing user input for this theme, create new
        otherwise, update existing
        */
        if (!this.userThemeInputs) {
            this.themeService.createUserThemeImput(this.theme._id, this.themeProperties)
                .subscribe(
                    data => {
                        console.log(data);
                        //this.router.navigate(['/theme', this.theme._id]);
                        window.location.reload();
                    },
                    error => {
                        console.log(error)
                    }
                );
        } else {
            console.log('User theme inputs angular')
            console.log(this.userThemeInputs)
            console.log(this.userThemeInputsId)
            console.log('theme id: ' + this.theme._id)
            this.themeService.updateUserThemeInput(this.userThemeInputsId, this.themeProperties)
                .subscribe(
                    data => {
                        console.log(data);
                        //this.router.navigate(['/theme', this.theme._id]);
                        window.location.reload();

                    },
                    error => {
                        console.log(error)
                    }
                );
        }
    }
}