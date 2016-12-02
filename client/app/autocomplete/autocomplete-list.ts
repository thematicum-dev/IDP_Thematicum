import {AutocompleteItem} from "./autocomplete-item";
import {isNullOrUndefined} from "util";
import {ThemeTagsService} from "../theme_creation/theme-tags.service";

export class AutocompleteList {
    filteredList: AutocompleteItem[] = [];
    query: string = '';
    list: AutocompleteItem[]

    filterList() {
        console.log('at filterList')
        console.log(this.list)
        console.log(this.query)
        this.filteredList =  this.query !== '' ?
            this.list.filter((el: any) => {
                return el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }) :
            [];

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
        if (this.filteredList[position]) {
            this.filteredList[position].selected = true;
            this.query = this.filteredList[position].name;
        }
    }

    emptyList() {
        this.filteredList = [];
    }
}