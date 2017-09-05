import { Component, Input, OnInit } from '@angular/core';
import {StockModel} from "../models/stockModel";

@Component({
    selector: 'app-admin-stocks-manager',
    templateUrl: 'admin-stocks-manager.component.html',
})

export class AdminStocksManager implements OnInit {

    selectedStock: StockModel;
    
    ngOnInit(): void {
        
    }

    searchTermStock(stock: StockModel){
        this.selectedStock = stock;
        console.log("admin stocks manager");
        console.log(stock);
        // this.searchTerm = stock._id;
    }
    
}