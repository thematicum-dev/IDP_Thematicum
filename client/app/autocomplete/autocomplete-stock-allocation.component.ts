import {Component} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {Stock} from "../models/stock";
import {StockAllocation} from "../models/stockAllocation";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";
import {Input} from "@angular/core/src/metadata/directives";
import {AutocompleteItem} from "./autocomplete-item";

@Component({
    selector: 'app-autocomplete-stock-allocation',
    templateUrl: 'autocomplete-stock-allocation.component.html',
    providers: [AutocompleteDatasourceService],
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
export class AutoCompleteStockAllocationComponent extends AutoCompleteContainerComponent {
    @Input() preFilterStockIds: string[];
    stockExposures = ['Strong Positive', 'Weak Positive', 'Neutral', 'Weak Negative', 'Strong Negative'];
    currentlySelectedStock: Stock;
    baseAPI = 'https://thematicum.herokuapp.com/api/';
    constructor(private dataSource: AutocompleteDatasourceService) {
        this.dataSourceAPI = this.baseAPI + 'stocks' + '?token=' + localStorage.getItem('token');
        this.autocompletePlaceholder = 'Search by company name';
        this.allowCustomValues = false;
        this.allowEnterKey = false;
        this.allowDirectClick = false;
        super(dataSource);
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

    preFilter() {
        if(!this.preFilterStockIds) {
            return;
        }
        //filter stocks already allocated to theme from being displayed in the autocomplete
        this.itemList = this.itemList.filter((item: AutocompleteItem) => this.preFilterStockIds.indexOf(item.id) < 0);
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
            //TODO: refactor this call to child component
            stocksAutocomplete.clearCurrentlySelectedItem();
        }
    }
}