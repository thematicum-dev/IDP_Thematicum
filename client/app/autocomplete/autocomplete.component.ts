import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'autocomplete',
    template: `
    <input #input type="text" class="form-control input-list" [(ngModel)]="query" (keyup)="filter($event)">
    <ul id="list-group" class="list-group group-list" *ngIf="filteredList.length > 0">
        <li *ngFor="let item of filteredList" [class.active]="item.selected" [id]="item.selected" class="list-group-item item-list" (click)="select(item)">
          {{ item.name }}
        </li>
    </ul>
    <p *ngIf="selectedItem">Selected: {{ selectedItem | json }}</p>
    <p>Test</p>
  `,
    host: {
        '(document:click)': 'handleClick($event)',
        '(keydown)': 'handleKeyDown($event)'
    },
})
export class AutoCompleteComponent {

    query: string = '';
    filteredList: any[] = [];
    elementRef: ElementRef;
    pos: number = -1;

    selectedItem: any;
    item: any; //TODO: delete variable
    items: any[] = [
        { id: 1, name: 'Darth Vader' },
        { id: 2, name: 'Kylo Ren' },
        { id: 3, name: 'Rey' },
        { id: 4, name: 'Ahsoka Tano' },
        { id: 5, name: 'Snoke' },
        { id: 6, name: 'Yoda' },
        { id: 7, name: 'Han Solo' },
        { id: 8, name: 'Luke Skywalker' },
        { id: 9, name: 'Obi-Wan Kenobi' },
        { id: 10, name: 'Darth Maul' },
        { id: 11, name: 'Chewbacca' },
        { id: 12, name: 'Boba Fett' },
        { id: 13, name: 'Darth Sidious' },
        { id: 14, name: 'Jabba the Hutt' },
        { id: 15, name: 'Qui-Gon Jinn' },
        { id: 16, name: 'Finn' },
        { id: 17, name: 'General Hux' },
        { id: 18, name: 'Poe Dameron' },
        { id: 19, name: 'Mace Windu'},
        { id: 20, name: 'Jar Jar Binks'}
    ];

    constructor(private el: ElementRef) {
        this.elementRef = el;
    }

    /** set filteredList to the items containing the query */
    filterQuery() {
        this.filteredList = this.items.filter((el: any) => {
            return el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        });
    }

    /** input keyup event handler */
    filter(event: any) {
        if (this.query !== '') {
            this.filterQuery();
        } else {
            this.filteredList = [];
        }

        //set 'selected' to false for all items in the filteredList
        for (let i = 0; i < this.filteredList.length; i++) {
            this.filteredList[i].selected = false;
        }

        //if there is a selected item
        //compare the this item's id to the id of every item in the filteredList
        //if ids agree, update the 'pos' to the position of the selected item in the filteredList
        if (this.selectedItem) {
            this.filteredList.map((i) => {
                if (i.id == this.selectedItem.id) {
                    this.pos = this.filteredList.indexOf(i);
                }
            })
            this.selectedItem = null; //why?
        }

        // Arrow-key Down
        if (event.keyCode == 40) {
            //if this is not the last element on the list, increment 'pos'
            if (this.pos + 1 != this.filteredList.length)
                this.pos++;
        }

        // Arrow-key Up
        if (event.keyCode == 38) {
            //if this is not the first element on the list
            if (this.pos > 0)
                this.pos--;
        }

        //if there exists an item in filteredList at 'pos' index
        if (this.filteredList[this.pos] !== undefined)
            this.filteredList[this.pos].selected = true;

        //enter key => select element (if it's contained in the filteredList)
        if (event.keyCode == 13) {
            if (this.filteredList[this.pos] !== undefined) {
                this.select(this.filteredList[this.pos]);
            }
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

    select(item: any) {
        this.selectedItem = item;
        this.selectedItem.selected = true;
        this.query = item.name;
        // this.query = '';
        this.filteredList = [];
    }

    handleKeyDown(event: any) {
        // Prevent default actions of arrows
        if (event.keyCode == 40 || event.keyCode == 38) {
            event.preventDefault();
        }
    }

    /** Handle outside click to close suggestions**/
    handleClick(event: any) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
    }
}