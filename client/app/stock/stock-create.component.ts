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
         
    ngOnInit(): void { 
        super.ngOnInit();
        this.stockCommand = "Save";
    }

    onSubmit(form: NgForm) {
        this.getStockService().createStock(this.currentlyAddedStock).subscribe(this.handleResults, this.handleError);
    }

}