import {Component, OnInit} from '@angular/core';
import { StockFieldsComponent } from './stock-field.component';
import {StockService} from "../services/stock.service";
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-stock-update',
    templateUrl: 'stock-field.component.html',
})
export class StockUpdateComponent extends StockFieldsComponent implements OnInit{
         
    isUpdate: boolean = true;

    ngOnInit(): void { 
        super.ngOnInit();
        this.stockCommand = "Update";
    }

    onSubmit(form: NgForm) {
        console.log("Update");
        //this.getStockService().createStock(this.currentlyAddedStock).subscribe(this.handleResults, this.handleError);
    }

}