import {Component, OnInit} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";
import {AutocompleteItem} from "./autocomplete-item";
import {ThemeTagsService} from "../theme_creation/theme-tags.service";

@Component({
    selector: 'app-autocomplete-tags',
    templateUrl: 'autocomplete-tags.component.html'
})
export class AutoCompleteTagsComponent extends AutoCompleteContainerComponent implements OnInit, AutocompleteItemSelectionInterface {
    autocompletePlaceholder = 'Keyword';
    allowCustomValues: boolean = true;
    allowEnterKey: boolean = true;
    allowDirectClick: boolean = true;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items

    ngOnInit(): void {
        this.themeTagService.getAutocompleteList().subscribe(data => {
                for (let tag of data) {
                    this.itemList.push(new AutocompleteItem(tag));
                }
            },
            error => {
                console.log(error)
            });
    }

    constructor(private themeTagService: ThemeTagsService) {}

    selectItem(item: any) {
        let existingItem = this.selectedItems.find(el => {
            return el == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.selectedItems.push(item.name);
        } else {
            this.error = 'This item has already been selected. Please choose another one';
        }
    }

    deselectItem(index: number) {
        if (index >= 0 && index < this.selectedItems.length) {
            this.selectedItems.splice(index, 1);
        }
    }
}