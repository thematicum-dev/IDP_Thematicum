import {Component} from '@angular/core';
import {ThemeCreationModel} from "../models/themeCreationModel";
import {Theme} from "../models/theme";
import {NgForm} from "@angular/forms";
import {ThemeService} from "./theme.service";
import {Router} from "@angular/router";
import {ThemeProperties} from "../models/themeProperties";
import {StockAllocation} from "../models/stockAllocation";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {AutoCompleteContainerComponent} from "../autocomplete/autocomplete-container.component";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    styles: [`.btn-default.active, .btn-default:active {
        background-color: #d9edf7
    }`]
})
export class ThemeCreationComponent {
    themeCreation: ThemeCreationModel;

    constructor(
        private themeService: ThemeService,
        private router: Router) {

        let theme = new Theme();
        // theme.tags = this.selectedTags;
        this.themeCreation = new ThemeCreationModel(theme, new ThemeProperties());
    }

    onSubmit(form: NgForm, themeTags: AutoCompleteContainerComponent, themeStockAllocation: AutoCompleteContainerComponent) {
        //call service to save theme
        console.log(themeTags.selectedItems)
        console.log(themeStockAllocation.selectedItems)

        //update model with data from child components
        this.themeCreation.theme.tags = themeTags.selectedItems;
        this.themeCreation.stockAllocation = themeStockAllocation.selectedItems
            .map(function(item: StockAllocation) {
                return new StockAllocationModel(item.stock.id, item.exposure);
            });
        this.themeCreation.themeProperties.setCheckedCategories();

        this.themeService.createTheme(this.themeCreation)
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigate(['/theme', data.obj[0]._id]);
                },
                error =>  {
                    console.log(error)
                }
            );
    }
}