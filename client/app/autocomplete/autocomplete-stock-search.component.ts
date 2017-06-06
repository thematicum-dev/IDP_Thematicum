import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {StockModel} from "../models/stockModel";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";
import {AutocompleteItem} from "./autocomplete-item";
import * as Settings from '../utilities/settings';
import {StockAllocationModel} from "../models/stockAllocationModel";

@Component({
    selector: 'app-autocomplete-stock-search',
    templateUrl: 'autocomplete-stock-search.component.html',
    providers: [AutocompleteDatasourceService],
 
})
export class AutoCompleteStockSearchComponent extends AutoCompleteContainerComponent implements OnInit {
    currentlySelectedStock: StockModel;

    constructor(public dataSource: AutocompleteDatasourceService) {
        super(dataSource,
            Settings.getBaseApi() + 'stocks',
            'search by company name',
            false, false, false);
    }
    
    @Output('stock')
    stock: EventEmitter<StockModel> = new EventEmitter<StockModel>();

    ngOnInit(): void {
        console.log('ngOnInit at AutoCompleteContainerComponent');
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(this.handleResults, this.handleError);
    }

    initializeAutocompleteData(data: any[]) {
        this.itemList = data.map(item => new StockModel(item.companyName,
                                item.ticker,
                                item._id,
                                item.businessDescription,
                                item.country,
                                item.website,
                                item.exchange,
                                item.reportingCurrency));
    }

    selectItem(item: any) {
        //search by name (assume unique name)
        let existingItem = this.selectedItems.find((el: StockAllocationModel) => {
            return el.stockName == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.currentlySelectedStock = item;
            this.stock.emit(this.currentlySelectedStock);
        } else {
            this.error = this.duplicateChosenErrorStr;
        }
    }
}