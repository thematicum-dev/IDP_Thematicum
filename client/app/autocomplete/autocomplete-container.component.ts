import {AutocompleteItem} from "./autocomplete-item";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";

export class AutoCompleteContainerComponent implements AutocompleteItemSelectionInterface {
    autocompletePlaceholder = '';
    allowCustomValues: boolean;
    allowEnterKey: boolean;
    allowDirectClick: boolean;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items
    duplicateChosenErrorStr = 'This item has already been selected. Please choose another one';

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