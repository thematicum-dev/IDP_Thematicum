import {Component, OnInit} from '@angular/core';
import {Theme} from "../models/theme";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {Router} from "@angular/router";
import {ThemePropertiesEditModel} from "../models/themePropertiesEditModel";
import {AutoCompleteContainerComponent} from "../autocomplete/autocomplete-container.component";
import {timeHorizonValues, maturityValues, categoryValues, geographyValues, sectorValues} from "../models/themePropertyValues";
import {Observable} from "rxjs";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    styles: [`.btn-default.active, .btn-default:active {
        background-color: #d9edf7
    }`]
})
export class ThemeCreationComponent implements OnInit{
    theme: Theme = new Theme();
    themeProperties: ThemePropertiesEditModel;
    createdThemeId: string;

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;
    geographyValues = geographyValues;
    sectorValues = sectorValues;
    maxDescriptionLength: number = 500;

    constructor(private themeService: ThemeService, private router: Router) {}

    ngOnInit(): void {  
        this.themeProperties = new ThemePropertiesEditModel();
    }

    onSubmit(form: NgForm, themeTags: AutoCompleteContainerComponent, themeStockAllocation: AutoCompleteContainerComponent, themeFundAllocation: AutoCompleteContainerComponent) {
        //update model with data from child components
        this.theme.tags = themeTags.selectedItems;
        this.themeProperties.setCheckedCategories();
        this.themeProperties.setCheckedGeographies();
        this.themeProperties.setCheckedSectors();
        const stockAllocation = themeStockAllocation.selectedItems;
        const fundAllocation = themeFundAllocation.selectedItems;

        this.themeService.createTheme(this.theme).flatMap(theme => {
            this.createdThemeId = theme._id;
            let propertiesObservable = this.themeService.createUserThemeInput(theme._id, this.themeProperties);
            let stockAllocationObservable = this.themeService.createManyStockCompositionsAndAllocations(theme._id, stockAllocation);
            let fundAllocationObservable = this.themeService.createManyFundCompositionsAndAllocations(theme._id, fundAllocation);

            return Observable.forkJoin([propertiesObservable, stockAllocationObservable, fundAllocationObservable]);
        }).subscribe(this.handleResults, this.handleError)
    }

    handleResults = (data: any) => {
        this.router.navigate(['/theme', this.createdThemeId]);
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }

    getDescriptionCharactersRemaining(): string {
        const descriptionLength = this.theme.description ? this.theme.description.length : 0;
        return `${this.maxDescriptionLength - descriptionLength} characters remaining`;
    }
}