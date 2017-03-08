import {Component} from '@angular/core';
import {Theme} from "../models/theme";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {Router} from "@angular/router";
import {ThemePropertiesEditModel} from "../models/themePropertiesEditModel";
import {StockAllocation} from "../models/stockAllocation";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {AutoCompleteContainerComponent} from "../autocomplete/autocomplete-container.component";
import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";
import {Observable} from "rxjs";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    styles: [`.btn-default.active, .btn-default:active {
        background-color: #d9edf7
    }`]
})
export class ThemeCreationComponent {
    theme: Theme = new Theme();
    themeProperties: ThemePropertiesEditModel = new ThemePropertiesEditModel();
    createdThemeId: string;

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    constructor(private themeService: ThemeService, private router: Router) {}

    onSubmit(form: NgForm, themeTags: AutoCompleteContainerComponent, themeStockAllocation: AutoCompleteContainerComponent) {
        //update model with data from child components
        this.theme.tags = themeTags.selectedItems;
        this.themeProperties.setCheckedCategories();
        const stockAllocation = themeStockAllocation.selectedItems
            .map(function(item: StockAllocation) {
                return new StockAllocationModel(item.stock.id, item.exposure);
            });

        this.themeService.createTheme(this.theme).flatMap(theme => {
            this.createdThemeId = theme._id;
            let propertiesObservable = this.themeService.createUserThemeInput(theme._id, this.themeProperties);
            let stockAllocationObservable = this.themeService.createManyStockCompositionsAndAllocations(theme._id, stockAllocation);

            return Observable.forkJoin([propertiesObservable, stockAllocationObservable]);
        }).subscribe(this.handleResults, this.handleError)
    }

    handleResults = (data: any) => {
        this.router.navigate(['/theme', this.createdThemeId]);
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }
}