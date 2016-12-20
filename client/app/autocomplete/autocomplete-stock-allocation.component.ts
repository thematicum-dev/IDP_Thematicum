import {Component, OnInit, Inject} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";
import {AutocompleteItem} from "./autocomplete-item";
import {ThemeTagsService} from "../theme_creation/theme-tags.service";
import {StockService} from "../stock_allocation/stock.service";
import {Stock} from "../models/stock";
import {StockAllocation} from "../models/stockAllocation";
import {AutocompleteDatasourceInterface} from "./autocomplete-datasource-interface";
import {StockAllocationModel} from "../models/stockAllocationModel";

@Component({
    selector: 'app-autocomplete-stock-allocation',
    templateUrl: 'autocomplete-stock-allocation.component.html',
    providers: [
            StockService
        ],
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
export class AutoCompleteStockAllocationComponent extends AutoCompleteContainerComponent implements OnInit {
    autocompletePlaceholder = 'Search by company name';
    allowCustomValues: boolean = false;
    allowEnterKey: boolean = false;
    allowDirectClick: boolean = false;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items

    stockExposures = ['Strong Positive', 'Weak Positive', 'Neutral', 'Weak Negative', 'Strong Negative'];
    currentlySelectedStock: Stock;

    constructor(private autocompleteService: StockService) {}

    ngOnInit(): void {
        this.autocompleteService.getAutocompleteList().subscribe(data => {
                this.initializeAutocompleteData(data);
            },
            error => {
                console.log(error)
            });
    }

    initializeAutocompleteData(data: any) {
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
    }

    selectItem(item: any) {
        //TODO: can refactor this
        /*
            on selecting item: remove that item from the list of suggested stocks
            on removing item: add that item back to the list
         */
        //search by name (assume unique name)
        let existingItem = this.selectedItems.find((el: StockAllocation) => {
            return el.stock.name == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.currentlySelectedStock = item;
        } else {
            this.error = this.duplicateChosenErrorStr;
        }
    }

    onSelectExposure(index: number, stocksAutocomplete: any) {
        //add allocated stock
        if (this.currentlySelectedStock) {
            //TODO: can add a StockAllocationModel instead, or another object, having fewer properties
            this.selectedItems.push(new StockAllocation(this.currentlySelectedStock, index));
            this.currentlySelectedStock = null;
            stocksAutocomplete.clearCurrentlySelectedItem();
        }
    }
}