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

    filterQuery() {
        //set filteredList to the items containing the query
        this.filteredList = this.items.filter((el: any) => {
            return el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        });
    }

    filter(event: any) {
        //input keyup event handler
        if (this.query !== '') {
            this.filterQuery();
        } else {
            this.filteredList = [];
        }

        for (let i = 0; i < this.filteredList.length; i++) {
            this.filteredList[i].selected = false;
        }

        if (this.selectedItem) {
            this.filteredList.map((i) => {
                if (i.id == this.selectedItem.id) {
                    this.pos = this.filteredList.indexOf(i);
                }
            })
            this.selectedItem = null;
        }

        // Arrow-key Down
        if (event.keyCode == 40) {
            if (this.pos + 1 != this.filteredList.length)
                this.pos++;
        }

        // Arrow-key Up
        if (event.keyCode == 38) {
            if (this.pos > 0)
                this.pos--;
        }

        if (this.filteredList[this.pos] !== undefined)
            this.filteredList[this.pos].selected = true;

        //enter
        if (event.keyCode == 13) {
            if (this.filteredList[this.pos] !== undefined) {
                this.select(this.filteredList[this.pos]);
            }
        }

        // Handle scroll position of item
        let listGroup = document.getElementById('list-group');
        let listItem = document.getElementById('true');
        if (listItem) {
            listGroup.scrollTop = (listItem.offsetTop - 200);
        }

    }

    select(item: any) {
        this.selectedItem = item;
        this.selectedItem.selected = true;
        this.query = item.name;
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