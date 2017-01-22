import {Component, OnInit} from '@angular/core';
import {ThemeSearchService} from "../theme_search/theme-search.service";
import {ThemeService} from "../theme_creation/theme.service";
import {ThemeProperties} from "../models/themeProperties";
import {ModalComponent} from "./modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";
import {NgForm} from "@angular/forms";
import {Input} from "@angular/core/src/metadata/directives";
import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";

@Component({
    selector: 'app-theme-properties',
    templateUrl: 'theme-properties.component.html',
    styles: [
        `
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
        .modal {
            background: rgba(0,0,0,0.6);
        }
        .dropdown-toggle:active {
            background: white;
        }
        .open>.dropdown-toggle {
            background: white;
            box-shadow: none;
        }
        `
    ]
})
export class ThemePropertiesComponent implements OnInit {
    @Input() themeId: string;
    themePropertiesAggregation: any;
    userThemeInputs: any;
    userThemeInputsId: any;
    isEditMode: boolean = false;
    //theme data - for user editing
    themeProperties: ThemeProperties = new ThemeProperties();

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    WHITE_COLOR = '#ffffff';
    YELLOW_USER_THEME_INPUT = '#fcf8e3';

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(private searchService: ThemeSearchService, private themeService: ThemeService) { }

    ngOnInit(): void {
        this.searchService.getThemeProperties(this.themeId).subscribe(
            data => {
                this.themePropertiesAggregation = data.properties;
                console.log('Properties: ', this.themePropertiesAggregation)
            },
            error => {
                console.log('Error getting theme properties: ', error);
            }
        );


        this.searchService.getThemePropertiesByUser(this.themeId).subscribe(
            data => {
                if (data.themeProperties) {
                    console.log('Properties: ', data.themeProperties)
                    //TODO: maybe wrap everything in a single object
                    this.userThemeInputs = data.themeProperties;
                    this.userThemeInputsId = data._id;
                }
            },
            error => {
                //No need to handle this error in particular, user simply hasn't input anything for this theme
                console.log('Error getting theme properties by user: ', error);
            }
        );
    }

    getPropertyVoteDistributionStr(percentage: number, nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `${percentage}% (${nrUsers} user${trailingS})`;
    }

    toggleEditMode(containerDiv: Element) {
        this.isEditMode = !this.isEditMode;
        console.log('Container div: ', containerDiv)

        if(!containerDiv) {
            return;
        }

        //TODO: containerDiv is undefined
        let labels = containerDiv.querySelectorAll('label.active');
        for (let i = 0; i<labels.length; i++) {
            labels[i].classList.remove('active');
        }
    }

    setPropertyBackgroundColor(propertyName, index) {
        if (this.isEditMode) {
            return;
        }

        //TODO: 1st condition is not really needed
        if (!this.isEditMode && !this.userThemeInputs) {
            return this.WHITE_COLOR;
        }

        if (propertyName == "categories") {
            return this.userThemeInputs[propertyName].indexOf(index) < 0 ? this.WHITE_COLOR : this.YELLOW_USER_THEME_INPUT;
        } else {
            return this.userThemeInputs[propertyName] != index ? this.WHITE_COLOR : this.YELLOW_USER_THEME_INPUT;
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
            this.themeService.createUserThemeImput(this.themeId, this.themeProperties)
                .subscribe(
                    //this.themePropertiesEditingSubscription()
                    data => {
                        console.log(data);
                        //this.router.navigate(['/theme', this.theme._id]);
                        //TODO: remove this, instead issue another http request to get the "refreshed" user properties
                        window.location.reload();
                    },
                    error => {
                        console.log(error)
                    }
                );
        } else {
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

    deleteUserThemeInput(modal: any) {
        if(this.userThemeInputsId) {
            this.themeService.deleteUserThemeInput(this.userThemeInputsId).subscribe(
                data => {
                    console.log(data);
                    modal.hide();
                    window.location.reload();
                },
                error => {
                    //TODO: handle error
                    console.log(error);
                    modal.hide();
                }
            )
        }
    }
}