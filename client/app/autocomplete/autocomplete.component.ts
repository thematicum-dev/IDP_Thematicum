import {
    Component, ElementRef, OnInit, EventEmitter, OnChanges, SimpleChanges, SimpleChange,
    DoCheck
} from '@angular/core';
import {AutocompleteList} from "./autocomplete-list";
import {items} from "./dummy-data";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {AutocompleteDatasourceInterface} from "./autocomplete-datasource-interface";
import {AutocompleteItem} from "./autocomplete-item";
import {ThemeTagsService} from "../theme_creation/theme-tags.service";

@Component({
    selector: 'app-autocomplete',
    templateUrl: 'autocomplete.component.html',
    host: {
        '(document:click)': 'handleClick($event)',
        '(keydown)': 'handleKeyDown($event)'
    },
    providers: [ThemeTagsService]
})
export class AutoCompleteComponent {
    const KEY_ARROW_UP = 38;
    const KEY_ARROW_DOWN = 40;
    const KEY_ENTER = 13;


    position: number = -1;

    @Input('allowCustomValues') allowUserEnteredValues: boolean;
    @Input() allowEnterKey: boolean;
    @Input() dataSource: any[];
    autocompleteList: AutocompleteList; //items as argument
    @Input() placeholderTerm: string;
    @Output() notifySelectedItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() clearErrorStr: EventEmitter = new EventEmitter();

    constructor(private elementRef: ElementRef, private themeTagService: ThemeTagsService) {
        console.log('at autocomplete')
        console.log(this.dataSource)
        this.autocompleteList = new AutocompleteList(); //items as argument
        //this.autocompleteList.list = items;
    }

    ngOnInit(): void {
        this.themeTagService.getAutocompleteList().subscribe(data => {
            var tagList: AutocompleteItem[] = [];
            for (let tag of data) {
                    tagList.push(new AutocompleteItem(tag, tag + ' alias'));
                }

                this.autocompleteList = new AutocompleteList();
                this.autocompleteList.list = tagList;
            },
            error => {
                console.log(error)
            });
    }


    /** set filteredList to the items containing the query */
    filterQuery() {
        this.autocompleteList.filterList();
    }

    /** input keyup event handler */
    filter(event: any) {
        //set 'selected' to false for all items in the filteredList
        this.autocompleteList.deselectAll();
        this.clearErrorStr.emit(); //clear error string

        switch(event.keyCode) {
            case this.KEY_ARROW_UP:
                this.handleKeyArrowUp();
                break;
            case this.KEY_ARROW_DOWN:
                this.handleKeyArrowDown();
                break;
            case this.KEY_ENTER:
                this.handleKeyEnter();
                break;
            default:
                this.filterQuery();
        }

        // Handle scroll position of item (Not convinced)
        // let listGroup = document.getElementById('list-group');
        // let listItem = document.getElementById('true');
        // if (listItem) {
        //     //listGroup.scrollTop = (411 - listItem.offsetTop);
        //     listGroup.scrollTop = (listItem.offsetTop - 200);
        // }
    }

    handleKeyArrowUp() {
        if (this.position > 0)
            this.position--;
        this.autocompleteList.selectItem(this.position);
    }

    handleKeyArrowDown() {
        if (this.position + 1 != this.autocompleteList.filteredList.length)
            this.position++;
        this.autocompleteList.selectItem(this.position);

    }

    handleKeyEnter() {
        if (!this.allowEnterKey) {
            return;
        }

        let itemToAdd = this.autocompleteList.getItemAt(this.position);

        if (itemToAdd) {
            this.autocompleteList.selectItem(this.position);
            this.addSelectedItem(itemToAdd);
        } else if (this.allowUserEnteredValues) {
            this.addSelectedItem({name: this.autocompleteList.query});
        }
    }

    addSelectedItem(item: any) {
        //emit event
        this.notifySelectedItem.emit(item);

        this.cleanup();
    }

    handleKeyDown(event: any) {
        // Prevent default actions of arrow keys
        if (event.keyCode == this.KEY_ARROW_DOWN || event.keyCode == this.KEY_ARROW_UP || event.keyCode == this.KEY_ENTER) {
            event.preventDefault();
        }
    }

    /** Handle outside click to close autocomplete list **/
    handleClick(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            //if the click occurs in an element (event.target) contained in elementRef, then empty filtered list
            this.cleanup();
        }
    }

    cleanup() {
        this.autocompleteList.query = '';
        this.position = -1;
        this.autocompleteList.deselectAll();
        this.autocompleteList.emptyList();
    }
}