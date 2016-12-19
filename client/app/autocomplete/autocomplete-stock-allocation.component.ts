import {Component, OnInit} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";
import {AutocompleteItem} from "./autocomplete-item";
import {ThemeTagsService} from "../theme_creation/theme-tags.service";
import {StockService} from "../stock_allocation/stock.service";
import {Stock} from "../models/stock";
import {StockAllocation} from "../models/stockAllocation";

@Component({
    selector: 'app-autocomplete-stock-allocation',
    templateUrl: 'autocomplete-stock-allocation.component.html',
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
        td>label {
            padding: 6px 12px; 
            margin-bottom: 0px;
        }
    `]
})
export class AutoCompleteStockAllocationComponent extends AutoCompleteContainerComponent implements OnInit, AutocompleteItemSelectionInterface {
    autocompletePlaceholder = 'Search by company name';
    allowCustomValues: boolean = false;
    allowEnterKey: boolean = false;
    allowDirectClick: boolean = false;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items

    stockExposures = ['Strong Positive', 'Weak Positive', 'Neutral', 'Weak Negative', 'Strong Negative'];
    currentlySelectedStock: Stock;

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
                    this.itemList.push(stock);
                }
            },
            error => {
                console.log(error)
            });
    }

    constructor(private stockService: StockService) {}

    selectItem(item: any) {
        //TODO: duplicate entries
        //search by name (assume unique name)
        let existingItem = this.selectedItems.find((el: StockAllocation) => {
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

    deselectItem(index: number) {
        this.selectedItems.splice(index, 1);
    }

    onSelectExposure(index: number, stocksAutocomplete: any) {
        //add allocated stock
        if (this.currentlySelectedStock) {
            this.selectedItems.push(new StockAllocation(this.currentlySelectedStock, index));
            //notify parent component about allocated stock
            //this.notifyAllocatedStocks.emit(new StockAllocationModel(this.currentlySelectedStock.id, index));
            this.currentlySelectedStock = null;
            stocksAutocomplete.clearCurrentlySelectedItem();
        }
    }
}