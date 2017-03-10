import {Component, Input, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import {AutoCompleteContainerComponent} from "./autocomplete-container.component";
import {AutocompleteItem} from "./autocomplete-item";
import {AutocompleteDatasourceService} from "./autocomplete-datasource.service";
import * as Settings from '../utilities/settings';

@Component({
    selector: 'app-autocomplete-tags',
    templateUrl: 'autocomplete-tags.component.html',
    providers: [AutocompleteDatasourceService]
})
export class AutoCompleteTagsComponent extends AutoCompleteContainerComponent implements OnInit, OnChanges {
    @Input() themeTags: any[];

    constructor(public dataSource: AutocompleteDatasourceService) {
        super(dataSource,
            Settings.getBaseApi() + 'themes/tags',
            'Keyword',
            true, true, true);
    }

    ngOnInit(): void {
        console.log('ngOnInit at AutoCompleteContainerComponent');
        this.dataSource.getAutocompleteList(this.dataSourceAPI).subscribe(this.handleResults, this.handleError);
    }

    ngOnChanges(changes: SimpleChanges): void {
        var themeTagsInputChange: any[] = changes['themeTags'].currentValue;
        if (themeTagsInputChange) {
            this.selectedItems = this.themeTags;
        }
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
        this.itemList = data.map(tag => new AutocompleteItem(tag));
    }
}