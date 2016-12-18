import {Component, OnInit} from '@angular/core';
import {AutocompleteItem} from "../autocomplete/autocomplete-item";
import {StockService} from "./stock.service";
import {Stock} from "../models/stock";

@Component({
    selector: 'app-stock-allocation',
    templateUrl: 'stock-allocation.component.html',
    providers: [StockService]
})
export class StockAllocationComponent implements OnInit {
    stockAllocationPlaceholder: String = 'Search by company name or ticker';
    allowCustomValues: boolean = false;
    allowEnterKey: boolean = false;

    stockList: AutocompleteItem[] = [];

    constructor(private stockService: StockService) {}

    ngOnInit(): void {
        this.stockService.getAutocompleteList().subscribe(data => {
                for (let item of data) {
                    var stock = new Stock(
                        item.companyName,
                        item.ticker,
                        item._id,
                        item.businessDescription,
                        item.country,
                        item.website,
                        item.exchange,
                        item.reportingCurrency);
                    this.stockList.push(stock);
                }
            },
            error => {
                console.log(error)
            });
    }

    onNotifySelectedItem(tag: any) {
        //search by name (assume unique name)
        // let existingItem = this.selectedTags.find(el => {
        //     return el == tag.name
        // });
        //
        // //do not add an item if it was already selected
        // if(!existingItem) {
        //     this.selectedTags.push(tag.name);
        // } else {
        //     this.error = 'This item has already been selected. Please choose another one';
        // }
    }

    onClearErrorStr() {
        // this.error = '';
    }


}