import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {StockService} from "../services/stock.service";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {StockModel} from "../models/stockModel";
import {stockInvestableValues_IM, searchDisabled_IM, stockInvestableOptions_IM} from "../models/IMultiSelectSettings";
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-stock-create',
    templateUrl: 'stock-field.component.html',
})
export class StockCreateComponent implements OnInit{
         
    isCreate: boolean = true;
    currentStock: StockModel;
    stockInvestableTextOptions = stockInvestableOptions_IM;
    stockInvestableOptions: IMultiSelectOption[] = stockInvestableValues_IM;
    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    formCancelled: boolean = false;
    companyAddedSuccessfully: boolean = false;

    @Output() stockCreated: EventEmitter<StockModel> = new EventEmitter<StockModel>();
    
    constructor(private stockService: StockService) {}
    
    ngOnInit(): void { 
        this.currentStock = new StockModel(
            "", "", "", "", "","","","",[]
        );
        this.companyAddedSuccessfully = false;
    }

    onSubmit(form: NgForm) {
        this.stockService.createStock(this.currentStock).subscribe(this.handleResults, this.handleError);
    }

    isFormIncomplete(){
        if( this.isDefined(this.currentStock.name) && 
            this.isDefined(this.currentStock.businessDescription) && 
            this.isDefined(this.currentStock.website) && 
            this.isDefined(this.currentStock.country) && 
            this.isDefined(this.currentStock.investableInstrument)) {
                return false;
            }
            
        return true;
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

    isDefined(variable: any){
        if(typeof variable === 'undefined' || (typeof variable !== 'undefined' && variable.length == 0))
            return false;
        return true;
    }

}