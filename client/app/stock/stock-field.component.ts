import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {StockModel} from "../models/stockModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {stockInvestableValues_IM, searchDisabled_IM, stockInvestableOptions_IM} from "../models/IMultiSelectSettings";
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import {StockService} from "../services/stock.service";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-stock-field',
    templateUrl: 'stock-field.component.html',
})
export class StockFieldsComponent implements OnInit{
    
    currentStock: StockModel;
    stockInvestableTextOptions = stockInvestableOptions_IM;
    stockInvestableOptions: IMultiSelectOption[] = stockInvestableValues_IM;
    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    formCancelled: boolean = false;
    companyAddedSuccessfully: boolean = false;

    @Output() stockCreated: EventEmitter<StockModel> = new EventEmitter<StockModel>();

    constructor(private stockService: StockService, private themeService: ThemeService) {}

    ngOnInit(): void { 
        this.currentStock = new StockModel(
            "", "", "", "", "","","","",[]
        );
        this.companyAddedSuccessfully = false;
    }

    onSubmit(form: NgForm) {
        //this.stockService.createStock(this.currentStock).subscribe(this.handleResults, this.handleError);
    }

    handleResults = (data: StockModel) => {
        this.companyAddedSuccessfully = true;
        this.stockCreated.emit(data);
        this.cancelForm();
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }

    cancelForm(){
        this.formCancelled = true;
    }

    isFormIncomplete(){
  
    }

    getStockService(){
        return this.stockService;
    }
}