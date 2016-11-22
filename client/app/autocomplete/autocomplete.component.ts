import { Component, ElementRef, OnInit } from '@angular/core';
import {AutocompleteList} from "./autocomplete-list";
import {items} from "./dummy-data";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'autocomplete',
    template: `
    <p *ngIf="error" style="color:red">{{error}}</p>
    <input #input type="text" class="form-control input-list" [(ngModel)]="autocompleteList.query" (keyup)="filter($event)">
    <ul id="list-group" class="list-group group-list" *ngIf="autocompleteList.filteredList.length > 0">
        <li *ngFor="let item of autocompleteList.filteredList" [class.active]="item.selected" [id]="item.selected" class="list-group-item item-list" (click)="addSelectedItem(item)">
          {{ item.name }}
        </li>
    </ul>
    <p *ngIf="selectedItems">Selected: {{ selectedItems | json }}</p>
  `,
    host: {
        '(document:click)': 'handleClick($event)',
        '(keydown)': 'handleKeyDown($event)'
    },
})
export class AutoCompleteComponent {
    const KEY_ARROW_UP = 38;
    const KEY_ARROW_DOWN = 40;
    const KEY_ENTER = 13;

    autocompleteList: AutocompleteList = new AutocompleteList(items);
    selectedItems: any[] = []; //allow multiple item selection
    position: number = -1;
    allowUserEnteredValues: boolean = true;
    error: string = '';

    constructor(private elementRef: ElementRef) {}

    /** set filteredList to the items containing the query */
    filterQuery() {
        this.autocompleteList.filterList();
    }

    /** input keyup event handler */
    filter(event: any) {
        //set 'selected' to false for all items in the filteredList
        this.autocompleteList.deselectAll();
        this.error = '';

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

        // Not convinced
        // Handle scroll position of item
        // let listGroup = document.getElementById('list-group');
        // let listItem = document.getElementById('true');
        // if (listItem) {
        //     //listGroup.scrollTop = (listItem.offsetTop - 200);
        //     console.log(listGroup.offsetHeight);
        //     console.log(listItem.offsetTop);
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
        let itemToAdd = this.autocompleteList.getItemAt(this.position);

        if (itemToAdd) {
            this.autocompleteList.selectItem(this.position);
            this.addSelectedItem(itemToAdd);
        } else if (this.allowUserEnteredValues) {
            this.addSelectedItem({name: this.autocompleteList.query});
        }
    }

    addSelectedItem(item: any) {
        //search by name (assume unique name)
        let existingItem = this.selectedItems.find(el => {
            return el.name == item.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.selectedItems.push(item);
            this.cleanup();
        } else {
            this.error = 'This item has already been selected. Please choose another one';
        }
    }

    handleKeyDown(event: any) {
        // Prevent default actions of arrow keys
        if (event.keyCode == this.KEY_ARROW_DOWN || event.keyCode == this.KEY_ARROW_UP) {
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