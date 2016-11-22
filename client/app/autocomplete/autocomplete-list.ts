import {AutocompleteItem} from "./autocomplete-item";
import {isNullOrUndefined} from "util";

export class AutocompleteList {
    filteredList: AutocompleteItem[] = [];

    constructor(
        public list: AutocompleteItem[]
    ) {}

    filterList(query: string) {
        this.filteredList =  query !== '' ?
            this.list.filter((el: any) => {
                return el.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }) :
            [];
    }

    addItem(item: AutocompleteItem) {
        if(this.filteredList)
            this.filteredList.push(item);
    }

    removeItem(id: string) {
        let index = this.getItemIndex(id);
        if (index >0) this.filteredList.splice(index, 1);
    }

    getItem(id: string) {
        return this.filteredList.find(item => {
            return item.id == id
        });
    }

    getItemIndex(id: string) {
        let item = this.getItem(id);
        return isNullOrUndefined(item) ? -1 : this.filteredList.indexOf(item);
    }

    getItemAt(position: number) {
        if(this.filteredList) return this.filteredList[position];
    }

    deselectAll() {
        for (let item of this.filteredList) {
            item.selected = false;
        }
    }

    selectItem(position) {
        if (this.filteredList[position])
            this.filteredList[position].selected = true;
    }

    emptyList() {
        this.filteredList = [];
    }
}