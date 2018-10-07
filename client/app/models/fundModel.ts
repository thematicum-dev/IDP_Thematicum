import {AutocompleteItem} from "../autocomplete/autocomplete-item";
export class FundModel extends AutocompleteItem {
    constructor(
        public name: string,
        public parent: string,
        public _id: string,
        public isin: string,
    ) { super(name, isin,  _id); }
}