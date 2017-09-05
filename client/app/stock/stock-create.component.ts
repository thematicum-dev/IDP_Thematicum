import {Component, OnInit} from '@angular/core';
import { StockFieldsComponent } from './stock-field.component';
import {StockService} from "../services/stock.service";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-stock-create',
    templateUrl: 'stock-field.component.html',
})
export class StockCreateComponent extends StockFieldsComponent implements OnInit{
         
    isCreate: boolean = true;
    
    ngOnInit(): void { 
        super.ngOnInit();
    }

    onSubmit(form: NgForm) {
        this.getStockService().createStock(this.currentStock).subscribe(this.handleResults, this.handleError);
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

    isDefined(variable: any){
        if(typeof variable === 'undefined' || (typeof variable !== 'undefined' && variable.length == 0))
            return false;
        return true;
    }

}