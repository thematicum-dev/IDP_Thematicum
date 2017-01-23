import {Component, OnInit, EventEmitter} from '@angular/core';
import {ThemeSearchService} from "../theme_search/theme-search.service";
import {ThemeService} from "../theme_creation/theme.service";
import {ThemeProperties} from "../models/themeProperties";
import {ModalComponent} from "./modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";
import {NgForm} from "@angular/forms";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";
import {Observable} from "rxjs";

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
    //theme properties data - for user editing
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
        this.getJoinedObservable().subscribe(
            data => {
                console.log('data: ', data)
                if(data.isDataByUser) {
                    this.onNextThemePropertiesByUser(data);
                } else {
                    this.onNextThemeProperties(data);
                }
            },
            error => {
                console.log('error: ', error);
            }
        )
    }

    onNextThemeProperties(data: any) {
        this.themePropertiesAggregation = data.properties;
    }

    onNextThemePropertiesByUser(data: any) {
        if (data.themeProperties) {
            //TODO: maybe wrap everything in a single object
            this.userThemeInputs = data.themeProperties;
            this.userThemeInputsId = data._id;
        }
    }

    getJoinedObservable() {
        let themeProperties = this.searchService.getThemeProperties(this.themeId).map(themeProperty => {
            themeProperty.isDataByUser = false; //to distinguish between Observables' results
            return themeProperty;
        });
        let themePropertiesByUser =  this.searchService.getThemePropertiesByUser(this.themeId).map(propertyByUser => {
            propertyByUser.isDataByUser = true;
            return propertyByUser;
        });
        return Observable.concat(themeProperties, themePropertiesByUser);
    }

    getPropertyVoteDistributionStr(percentage: number, nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `${percentage}% (${nrUsers} user${trailingS})`;
    }

    clearEditing(containerDiv: Element) {
        this.isEditMode = !this.isEditMode;
        this.themeProperties.uncheckAllCategories();
        console.log('Container div: ', containerDiv)

        if(!containerDiv) {
            return;
        }

        //TODO: undefined containerDiv
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

    clearUserInputs() {
        this.userThemeInputs = null;
        this.userThemeInputsId = null;
        this.themeProperties.uncheckAllCategories();
        this.isEditMode = false;
    }

    createOrUpdateThemeProperty(form: NgForm) {
        this.themeProperties.setCheckedCategories();
        /*if there isn't any existing user input for this theme, create new
         otherwise, update existing
         */
        let themePropertyChangedObservable: Observable<any> = this.userThemeInputs ?
            this.themeService.updateUserThemeInput(this.userThemeInputsId, this.themeProperties)
                .map(input => {
                    input.isCreateOrUpdate = true;
                    return input;
                }) :
            this.themeService.createUserThemeImput(this.themeId, this.themeProperties)
                .map(input => {
                    input.isCreateOrUpdate = true;
                    return input;
                });

        this.clearUserInputs();

        Observable.concat(themePropertyChangedObservable, this.getJoinedObservable()).subscribe(
            data => {
                if (data.isCreateOrUpdate) {
                    console.log('Created or Updated: ', data);
                } else if(data.isDataByUser) {
                    this.onNextThemePropertiesByUser(data);
                } else {
                    this.onNextThemeProperties(data);
                }
            },
            error => {
                error => console.log(error)
            }
        );
    }

    deleteUserThemeInput(modal: any) {
        modal.hide();
        if(!this.userThemeInputsId) {
            return;
        }

        let themePropertyDeletedObservable: Observable<any> = this.themeService.deleteUserThemeInput(this.userThemeInputsId).map(input => {
                input.isDelete = true;
                return input;
            });

        this.clearUserInputs();

        Observable.concat(themePropertyDeletedObservable, this.getJoinedObservable()).subscribe(
            data => {
                if (data.isDelete) {
                    console.log('Deleted: ', data);
                } else if(data.isDataByUser) {
                    this.onNextThemePropertiesByUser(data);
                } else {
                    this.onNextThemeProperties(data);
                }
            },
            error => {
                //TODO: handle error
                error => console.log(error)
            }
        );
    }
}