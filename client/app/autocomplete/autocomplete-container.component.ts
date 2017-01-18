import {AutocompleteItem} from "./autocomplete-item";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";
import {OnInit} from "@angular/core";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";

export class AutoCompleteContainerComponent implements AutocompleteItemSelectionInterface, OnInit {
    constructor(private dataSource: AutocompleteDatasourceService) {}
    ngOnInit(): void {
        console.log('Implementing OnInit')
        console.log('Data source: ', this.dataSource)
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(data => {
            this.initializeAutocompleteData(data);
        },
        error => {
            console.log(error)
        });
    }
    autocompletePlaceholder = '';
    allowCustomValues: boolean;
    allowEnterKey: boolean;
    allowDirectClick: boolean;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items
    duplicateChosenErrorStr = 'This item has already been selected. Please choose another one';
    //TODO: provide api string as an input from parent
    dataSourceAPI = 'http://localhost:3000/api/themes/tags' + '?token=' + localStorage.getItem('token');

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