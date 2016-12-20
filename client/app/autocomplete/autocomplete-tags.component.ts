import {Component, OnInit, Injector, Inject} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteItemSelectionInterface} from "./autocomplete-item-selection-interface";
import {AutocompleteItem} from "./autocomplete-item";
import {ThemeTagsService} from "../theme_creation/theme-tags.service";
import {AutocompleteDatasourceInterface} from "./autocomplete-datasource-interface";

@Component({
    selector: 'app-autocomplete-tags',
    templateUrl: 'autocomplete-tags.component.html',
    providers: [
        ThemeTagsService
    ]
})
export class AutoCompleteTagsComponent extends AutoCompleteContainerComponent implements OnInit {
    autocompletePlaceholder = 'Keyword';
    allowCustomValues: boolean = true;
    allowEnterKey: boolean = true;
    allowDirectClick: boolean = true;
    error: string = '';
    itemList: AutocompleteItem[] = []; //data source (all items)
    selectedItems: any[] = []; //selected items

    //TODO: DI in inheritance
    constructor(private autocompleteService: ThemeTagsService) {}

    ngOnInit(): void {
        this.autocompleteService.getAutocompleteList().subscribe(data => {
                this.initializeAutocompleteData(data);
            },
            error => {
                console.log(error)
            });
    }

    selectItem(item: any) {
        //TODO: further refactor or extract this method
        let existingItem = this.selectedItems.find(el => {
            return el == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.selectedItems.push(item.name);
        } else {
            this.error = this.duplicateChosenErrorStr;
        }
    }

    initializeAutocompleteData(data: any) {
        for (let tag of data) {
            this.itemList.push(new AutocompleteItem(tag));
        }
    }
}