import { Component, ElementRef, OnInit } from '@angular/core';
import {AutocompleteList} from "./autocomplete-list";
import {items} from "./dummy-data";

@Component({
    selector: 'autocomplete',
    template: `
    <input #input type="text" class="form-control input-list" [(ngModel)]="query" (keyup)="filter($event)">
    <ul id="list-group" class="list-group group-list" *ngIf="autocompleteList.filteredList.length > 0">
        <li *ngFor="let item of autocompleteList.filteredList" [class.active]="item.selected" [id]="item.selected" class="list-group-item item-list" (click)="select(item)">
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

    query: string = '';
    autocompleteList: AutocompleteList = new AutocompleteList(items);

    pos: number = -1;
    allowUserEnteredValues: boolean = false;

    selectedItems: any[] = []; //allow multiple item selection


    constructor(private elementRef: ElementRef) {}

    /** set filteredList to the items containing the query */
    filterQuery() {
        this.autocompleteList.filterList(this.query);
    }

    /** input keyup event handler */
    filter(event: any) {
        //set 'selected' to false for all items in the filteredList
        this.autocompleteList.deselectAll();

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

        //Not convinced
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
        console.log(this.pos);
        if (this.pos > 0)
            this.pos--;
        this.autocompleteList.selectItem(this.pos);
    }

    handleKeyArrowDown() {
        console.log(this.pos);
        if (this.pos + 1 != this.autocompleteList.filteredList.length)
            this.pos++;
        this.autocompleteList.selectItem(this.pos);
    }

    handleKeyEnter() {
        if (this.autocompleteList.filteredList[this.pos] !== undefined) {
            //TODO: refactor select
            this.select(this.autocompleteList.filteredList[this.pos]);
            this.autocompleteList.selectItem(this.pos);
        }
    }

    select(item: any) {
        this.selectedItems.push(item);
        this.query = item.name;
        // this.query = '';
        this.pos = -1;
        this.autocompleteList.emptyList();
    }

    handleKeyDown(event: any) {
        // Prevent default actions of arrows
        if (event.keyCode == 40 || event.keyCode == 38) {
            event.preventDefault();
        }
    }

    /** Handle outside click to close suggestions**/
    handleClick(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            //if the click occurs in an element (event.target) contained in elementRef, then empty filtered list
            this.query = '';
            this.autocompleteList.emptyList();
        }
    }
}