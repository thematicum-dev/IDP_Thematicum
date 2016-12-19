import { Component } from '@angular/core';
import {AutocompleteItem} from "./autocomplete-item";

@Component({
    selector: 'app-autocomplete-container',
    template: '<p>Autocomplete Container</p>'
})
export class AutoCompleteContainerComponent {
    autocompletePlaceholder = '';
    allowCustomValues: boolean;
    allowEnterKey: boolean;
    allowDirectClick: boolean;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items

    clearErrorStr() {
        this.error = '';
    }
}