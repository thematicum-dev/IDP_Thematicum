import {Component} from '@angular/core';
import {ThemeCreationModel} from "../models/themeCreationModel";
import {Theme} from "../models/theme";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {Router} from "@angular/router";
import {ThemeProperties} from "../models/themeProperties";
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
    themeCreation: ThemeCreationModel = new ThemeCreationModel();

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    constructor(private themeService: ThemeService, private router: Router) {}

    onSubmit(form: NgForm, themeTags: AutoCompleteContainerComponent, themeStockAllocation: AutoCompleteContainerComponent) {
        //update model with data from child components
        this.themeCreation.theme.tags = themeTags.selectedItems;
        this.themeCreation.stockAllocation = themeStockAllocation.selectedItems
            .map(function(item: StockAllocation) {
                return new StockAllocationModel(item.stock.id, item.exposure);
            });
        this.themeCreation.themeProperties.setCheckedCategories();

        this.themeService.createTheme(this.themeCreation.theme).subscribe(
            theme => {
                let propertiesObservable = this.themeService.createUserThemeImput(theme._id, this.themeCreation.themeProperties);
                let stockAllocationObservable = this.themeService.createManyStockCompositionsAndAllocations(theme._id, this.themeCreation.stockAllocation);

                Observable.forkJoin([propertiesObservable, stockAllocationObservable]).subscribe(
                    data => {
                        console.log('Theme creation data: ', data);
                        //navigate
                        this.router.navigate(['/theme', theme._id]);
                    },
                    error => console.log(error)
                )
            },
            error => {
                console.log('Error at creating theme: ', error)
            }
        );
    }
}