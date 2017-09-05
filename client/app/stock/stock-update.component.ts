import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import { StockFieldsComponent } from './stock-field.component';
import {StockService} from "../services/stock.service";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {StockModel} from "../models/stockModel";

@Component({
    selector: 'app-stock-update',
    templateUrl: 'stock-field.component.html',
})
export class StockUpdateComponent extends StockFieldsComponent implements OnInit{
         
    isUpdate: boolean = true;

    @Input('stock')
    stock: StockModel;

    ngOnInit(): void { 
        super.ngOnInit();
    }

    onSubmit(form: NgForm) {
        console.log("Update");
        //this.getStockService().createStock(this.currentStock).subscribe(this.handleResults, this.handleError);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.stock && !changes.stock.firstChange) {
            this.currentStock = this.stock;
        }
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

    isDefined(variable: any){
        if(typeof variable === 'undefined' || (typeof variable !== 'undefined' && variable.length == 0))
            return false;
        return true;
    }
}