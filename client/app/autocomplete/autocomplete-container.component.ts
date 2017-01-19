import {AutocompleteItem} from "./autocomplete-item";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";
import {OnInit} from "@angular/core";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";

export class AutoCompleteContainerComponent implements AutocompleteItemSelectionInterface, OnInit {
    dataSourceAPI: string;
    autocompletePlaceholder = '';
    allowCustomValues: boolean;
    allowEnterKey: boolean;
    allowDirectClick: boolean;

    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items
    duplicateChosenErrorStr = 'This item has already been selected. Please choose another one';

    constructor(private dataSource: AutocompleteDatasourceService) {}

    ngOnInit(): void {
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(data => {
            this.initializeAutocompleteData(data);
        },
        error => {
            console.log(error)
        });
    }

    clearErrorStr() {
        this.error = '';
    }

    selectItem(item: any) {}

    deselectItem(index: number) {
        if (index >= 0 && index < this.selectedItems.length) {
            this.selectedItems.splice(index, 1);
        }
    }

    initializeAutocompleteData(data: any) {}
}