import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {StockService} from "../services/stock.service";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {StockModel} from "../models/stockModel";
import {stockInvestableValues_IM, searchDisabled_IM, stockInvestableOptions_IM} from "../models/IMultiSelectSettings";
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-stock-update',
    templateUrl: 'stock-field.component.html',
})
export class StockUpdateComponent implements OnInit{
         
    isUpdate: boolean = true;
    currentStock: StockModel;
    stockInvestableTextOptions = stockInvestableOptions_IM;
    stockInvestableOptions: IMultiSelectOption[] = stockInvestableValues_IM;
    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    formCancelled: boolean = false;
    companyUpdatedSuccessfully: boolean = false;

    @Input('stock')
    stock: StockModel;

    constructor(private stockService: StockService) {}

    ngOnInit(): void { 
        this.currentStock = new StockModel(
            "", "", "", "", "","","","",[]
        );
    }

    onSubmit(form: NgForm) {
        this.stockService.updateStock(this.currentStock).subscribe(this.handleResults, this.handleError);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.stock && !changes.stock.firstChange) {
            this.currentStock = this.stock;
        }
        this.companyUpdatedSuccessfully = false;
    }

    isFormIncomplete(){
        if( this.isDefined(this.currentStock._id) &&
            this.isDefined(this.currentStock.name) && 
            this.isDefined(this.currentStock.businessDescription) && 
            this.isDefined(this.currentStock.website) && 
            this.isDefined(this.currentStock.country) && 
            this.isDefined(this.currentStock.investableInstrument)) {
                return false;
            }            
        return true;
    }

    handleResults = (data: StockModel) => {
        console.log(data);
        this.companyUpdatedSuccessfully = true;
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }

    isDefined(variable: any){
        if(typeof variable === 'undefined' || (typeof variable !== 'undefined' && variable.length == 0))
            return false;
        return true;
    }
}