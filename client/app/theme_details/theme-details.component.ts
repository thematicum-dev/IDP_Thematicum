import {Component, OnInit, OnChanges, SimpleChanges, ElementRef, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";
import {NgForm} from "@angular/forms";
import {ThemeProperties} from "../models/themeProperties";
import {ThemeService} from "../theme_creation/theme.service";
import {Observable, Observer} from "rxjs";
import {ModalComponent} from "./modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";

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
    .well button.btn-default {
        background-color: #f5f5f5;
        text-decoration: none;
        outline:none;
        border: none;
        box-shadow: none;
    },
    .modal {
      background: rgba(0,0,0,0.6);
    }
`],
    providers: [ThemeSearchService]
})
export class ThemeDetailsComponent implements OnInit, OnChanges {
    //theme existing data
    theme: Theme;
    selectedThemeId: string;
    themePropertiesAggregation: any;
    userThemeInputs: any;
    userThemeInputsId: any;

    //theme data - for user editing
    themeProperties: ThemeProperties = new ThemeProperties();

    isEditMode: boolean = false;
    yellowColorCode = '#fcf8e3';
    whiteColor = 'white';
    wellBackgroundColor = '#f5f5f5';

    isCreator = true;
    isThemeCharacteristicsEditable = false;

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => {
                return Observable.of(params['id']);
            })
            .subscribe(id => this.selectedThemeId = id);

        this.searchService.getThemeById(this.selectedThemeId).subscribe(
            data => {
                console.log('ThemeId: ', this.selectedThemeId);
                this.theme = data;
                this.theme.createdAt = new Date(data.createdAt);
                //console.log(data)
            },
            error => {
                //TODO: handle error by displaying message
                console.log('Error getting theme data: ', error);
            });

        this.searchService.getThemeProperties(this.selectedThemeId).subscribe(
            data => {
                this.themePropertiesAggregation = data.properties;
                console.log('Properties: ', this.themePropertiesAggregation)
            },
            error => {
                console.log('Error getting theme properties: ', error);
            }
        );


        this.searchService.getThemePropertiesByUser(this.selectedThemeId).subscribe(
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

    ngOnChanges(changes: SimpleChanges): void {
        var themeChange: Theme = changes.theme.currentValue;
        if (themeChange) {
            // this.autocompleteList.list = this.dataSource;
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

    toggleThemeCharacteristicsEditable() {
        this.isThemeCharacteristicsEditable = !this.isThemeCharacteristicsEditable;
        //TODO: cancel changes to model
    }

    cancelThemeEditing(theme: Theme) {
        //cancel changes made to Theme, by restoring previous model
        this.theme = theme;

        //set isThemeCharacteristicsEditable to false
        this.isThemeCharacteristicsEditable = false;
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
            return
        }

        //console.log(this.userThemeInputs) //TODO: remove this - lots of lines
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
                    //this.themePropertiesEditingSubscription()
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

    //TODO: reuse observer?
    themePropertiesEditingSubscription() {
        return Observer.create(
            function (data) {
                console.log('Next: %s', data);
            },
            function (err) {
                console.log('Error: %s', err);
            },
            function () {
                console.log('Completed');
            });
    }

    closeModal(modal: any) {
        console.log('Closing modal ', this.userThemeInputsId)
        if(this.userThemeInputsId) {
            this.themeService.deleteUserThemeInput(this.userThemeInputsId).subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    //TODO: handle error
                    console.log(error);
                }
            )
        }
        modal.close();
    }
}