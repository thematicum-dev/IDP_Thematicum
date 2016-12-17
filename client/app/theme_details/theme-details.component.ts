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
        text-decoration: none;
        outline:none;
        box-shadow: none;
        border-color: #ccc;
        cursor: default;
    }
    .btn.active {
        /*background-color: white;*/
        /*text-decoration: none;*/
        /*outline:none;*/
        /*box-shadow: none;*/
        /*border-color: #ccc;*/
        background-color: red;
    }
    input[type="radio"]:checked, input[type="radio"]:not(checked){
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
    hasActive: boolean = false;
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

    test(event: Event) {
        if (!this.isEditMode) {
            //remove active class
            //event.target.nativeElement.removeClass('active');
           // event.srcElement.classList.remove('inactive-element');
            //console.log('test')
            return false;
        }

        //background-color
        // event.srcElement.classList.remove('inactive-element');
        // event.srcElement.classList.remove("btn-primary");
        // event.srcElement.classList.add("btn-primary");
        //event.srcElement.nextElementSibling.classList.remove('active');

        // if (!event.srcElement.classList.contains('active')) {
        //     console.log('is active')
        //     event.srcElement.classList.remove('active')
        // } else {
        //     console.log('not active')
        // }
    }

    getPropertyVoteDistributionStr(percentage: number, nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `${percentage}% (${nrUsers} user${trailingS})`;
    }

    constructor(private route: ActivatedRoute, private router: Router, private searchService: ThemeSearchService) { }

    toggleEditMode(timeHorizonDiv: Element) {
        this.isEditMode = !this.isEditMode;
        timeHorizonDiv.childNodes
        //console.log(timeHorizonDiv.getElementsByTagName('label').length)
        //let labels = timeHorizonDiv.getElementsByTagName('label');
        let labels = timeHorizonDiv.getElementsByClassName('active')
        console.log(labels)
        for (let i = 0; i<labels.length; i++) {
            console.log(labels[i].classList)
            labels[i].classList.remove('active');
        }
        // for (let label in labels) {
        //     console.log(label.classList)
        //     //label.classList.remove('btn-default');
        //     //label.blur()
        // }
        //timeHorizonDiv.getElementsByTagName('label')
        //timeHorizonDiv.classList.remove('btn-default')

        //timeHorizonDiv.children.forEach(function(label) { label.classList.remove('btn-default');});
    }

    setPropertyBackgroundColor(propertyName, index) {
        if (this.isEditMode) {
            return
        }

        if (!this.isEditMode && !this.userThemeInputs) {
            return this.whiteColor;
        }



        // if (!this.isEditMode && !this.userThemeInputs) {
        //     return this.whiteColor;
        // } else if (this.isEditMode && isActive) {
        //     return 'red'
        // }

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