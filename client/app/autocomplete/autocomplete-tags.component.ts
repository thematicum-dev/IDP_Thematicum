import {Component} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteItem} from "./autocomplete-item";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";

@Component({
    selector: 'app-autocomplete-tags',
    templateUrl: 'autocomplete-tags.component.html',
    providers: [AutocompleteDatasourceService]
})
export class AutoCompleteTagsComponent extends AutoCompleteContainerComponent {
    constructor(private dataSource: AutocompleteDatasourceService) {
        this.dataSourceAPI = 'http://localhost:3000/api/themes/tags' + '?token=' + localStorage.getItem('token');
        this.autocompletePlaceholder = 'Keyword';
        this.allowCustomValues = true;
        this.allowEnterKey = true;
        this.allowDirectClick = true;
        super(dataSource);
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