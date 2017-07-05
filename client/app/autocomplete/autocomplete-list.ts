import {AutocompleteItem} from "./autocomplete-item";

export class AutocompleteList {
    filteredList: AutocompleteItem[] = [];
    query: string = '';
    list: AutocompleteItem[];

    filterList() {
        //filter list by elements containing the query
        this.filteredList =  this.query !== '' ?
            this.list.filter((element: AutocompleteItem) => {
                return element.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }) :
            [];

    }

    isResultFound(){
        if(this.filteredList.length == 0 && this.query.length > 0)
            return false;
        return true;
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