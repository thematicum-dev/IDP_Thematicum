import {Component, OnInit, Input} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {StockModel} from "../models/stockModel";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";
import {AutocompleteItem} from "./autocomplete-item";
import * as Settings from '../utilities/settings';
import {StockAllocationModel} from "../models/stockAllocationModel";
import {FundModel} from "../models/fundModel";
import {FundAllocationModel} from "../models/fundAllocationModel";

@Component({
    selector: 'app-autocomplete-fund-allocation',
    templateUrl: 'autocomplete-fund-allocation.component.html',
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
            margin-bottom: 0;
        }
        span.input-group-btn {
            padding:0;
        }
        #fundsAutocomplete {
            padding-right: 0;
        }
    `]
})
export class AutoCompleteFundAllocationComponent extends AutoCompleteContainerComponent implements OnInit {
    @Input() preFilterFundIds: string[];
    fundExposures = ['Strong Positive', 'Weak Positive', 'Neutral', 'Weak Negative', 'Strong Negative'];
    currentlySelectedFund: FundModel;

    constructor(public dataSource: AutocompleteDatasourceService) {
        super(dataSource,
            Settings.getBaseApi() + 'funds',
            'search by fund name',
            false, false, false);
    }

    ngOnInit(): void {
        console.log('ngOnInit at AutoCompleteContainerComponent');
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(this.handleResults, this.handleError);
    }

    initializeAutocompleteData(data: any[]) {
        this.itemList = data.map(item => new FundModel(item.fundName,
            item.parent,
            item._id,
            item.isin));
    }

    preFilter() {
        if(!this.preFilterFundIds) {
            return;
        }
        //filter funds already allocated to theme from being displayed in the autocomplete
        this.itemList = this.itemList.filter((item: AutocompleteItem) => this.preFilterFundIds.indexOf(item._id) < 0);
    }

    selectItem(item: any) {
        //TODO: refactor
        /*
            on selecting item: remove that item from the list of suggested stocks
            on removing item: add that item back to the list
         */

        //search by name (assume unique name)
        let existingItem = this.selectedItems.find((el: FundAllocationModel) => {
            return el.fundName == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.currentlySelectedFund = item;
        } else {
            this.error = this.duplicateChosenErrorStr;
        }
    }

    onSelectExposure(index: number, fundsAutocomplete: any) {
        //add allocated stock
        if (this.currentlySelectedFund) {
            this.selectedItems.push(new FundAllocationModel(this.currentlySelectedFund._id, index, this.currentlySelectedFund.name));
            this.currentlySelectedFund = null;
            fundsAutocomplete.clearCurrentlySelectedItem();
        }
    }

    fundCreated(fund: FundModel){
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(this.handleResults, this.handleError);
    }

    isResultFound(found: boolean){
        if(found == true){
            this.resultFound = true;
        } else if(found == false){
            this.resultFound = false;
        }
    }
}