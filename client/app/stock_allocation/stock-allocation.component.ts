import {Component, OnInit} from '@angular/core';
import {AutocompleteItem} from "../autocomplete/autocomplete-item";
import {StockService} from "./stock.service";
import {Stock} from "../models/stock";
import {StockAllocation} from "../models/stockAllocation";

@Component({
    selector: 'app-stock-allocation',
    templateUrl: 'stock-allocation.component.html',
    providers: [StockService],
    styles: [`
        select, select:hover, select:focus {
            background-color: white;
            text-decoration: none;
            outline:none;
            border: none;
            box-shadow: none;
        }
        .btn.btn-link {
            color: red;
        }
    `]
})
export class StockAllocationComponent implements OnInit {
    stockAllocationPlaceholder: String = 'Search by company name or ticker';
    allowCustomValues: boolean = false;
    allowEnterKey: boolean = false;
    allowDirectClick: boolean = false;

    stockList: AutocompleteItem[] = [];
    allocatedStocks: StockAllocation[] = [];
    currentlySelectedStock: Stock;

    error: string = '';
    stockExposures = ['Strong Positive', 'Weak Positive', 'Neutral', 'Weak Negative', 'Strong Negative'];

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

    onClearErrorStr() {
        this.error = '';
    }

    onNotifySelectedItem(item: any) {
        //TODO: duplicate entries
        //search by name (assume unique name)
        let existingItem = this.allocatedStocks.find((el: StockAllocation) => {
            return el.stock.name == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            //this.selectedTags.push(tag.name);
            this.currentlySelectedStock = item;
        } else {
            this.error = 'This item has already been selected. Please choose another one';
        }
    }

    onSelectExposure(index: number, stocksAutocomplete: any) {
        //keep [] of {stock, exposure}
        //add new element to that []
        //emit event to autocomplete component
        if (this.currentlySelectedStock) {
            this.allocatedStocks.push(new StockAllocation(this.currentlySelectedStock, index));
            this.currentlySelectedStock = null;
            stocksAutocomplete.clearCurrentlySelectedItem();
        }

        console.log('test' + index)
    }

    removeStock(stockIndex: number) {
        this.allocatedStocks.splice(stockIndex, 1);
    }

}