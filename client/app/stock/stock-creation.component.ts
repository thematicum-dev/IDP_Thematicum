import {Component, OnInit} from '@angular/core';
import {StockModel} from "../models/stockModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {stockInvestableValues_IM, searchDisabled_IM, stockInvestableOptions_IM} from "../models/IMultiSelectSettings";
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import {StockService} from "../services/stock.service";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-stock-create',
    templateUrl: 'stock-creation.component.html',
})
export class StockCreationComponent implements OnInit{
    
    currentlyAddedStock: StockModel;
    stockInvestableTextOptions = stockInvestableOptions_IM;
    stockInvestableOptions: IMultiSelectOption[] = stockInvestableValues_IM;
    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    formCancelled: boolean = false;

    constructor(private stockService: StockService, private themeService: ThemeService) {}

    ngOnInit(): void { 
         this.currentlyAddedStock = new StockModel(
            "", "", "", "", "","","","",[]
        );
    }

    onSubmit(form: NgForm) {
        this.stockService.createStock(this.currentlyAddedStock).subscribe(this.handleResults, this.handleError);
    }

    handleResults = (data: any) => {
        console.log(data);
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }

    cancelForm(){
        this.formCancelled = true;
    }

    isFormIncomplete(){
        if(this.currentlyAddedStock.name.length == 0 || this.currentlyAddedStock.website.length == 0 || this.currentlyAddedStock.country.length == 0 || this.currentlyAddedStock.investableInstrument.length == 0)
            return true;
        return false;
    }
}