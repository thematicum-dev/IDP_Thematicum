import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";
import {AutocompleteItem} from "./autocomplete-item";
import * as Settings from '../utilities/settings';
import {FundModel} from "../models/fundModel";
import {FundAllocationModel} from "../models/fundAllocationModel";

@Component({
    selector: 'app-autocomplete-fund-search',
    templateUrl: 'autocomplete-fund-search.component.html',
    providers: [AutocompleteDatasourceService],

})
export class AutoCompleteFundSearchComponent extends AutoCompleteContainerComponent implements OnInit {
    currentlySelectedFund: FundModel;

    constructor(public dataSource: AutocompleteDatasourceService) {
        super(dataSource,
            Settings.getBaseApi() + 'funds',
            'search by fund name',
            false, false, false);
    }

    @Output('fund')
    fund: EventEmitter<FundModel> = new EventEmitter<FundModel>();

    ngOnInit(): void {
        console.log('ngOnInit at AutoCompleteContainerComponent');
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(this.handleResults, this.handleError);
    }

    initializeAutocompleteData(data: any[]) {
        this.itemList = data.map(item => new FundModel(item.fundName,
            item.fundParent,
            item._id,
            item.fundIsin));
    }

    selectItem(item: any) {
        //search by name (assume unique name)
        let existingItem = this.selectedItems.find((el: FundAllocationModel) => {
            return el.fundName == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.currentlySelectedFund = item;
            this.fund.emit(this.currentlySelectedFund);
        } else {
            this.error = this.duplicateChosenErrorStr;
        }
    }
}