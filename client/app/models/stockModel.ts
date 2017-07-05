import {AutocompleteItem} from "../autocomplete/autocomplete-item";
export class StockModel extends AutocompleteItem {
    constructor(
        public name: string,
        public alias: string,
        public _id: string,
        public businessDescription: string,
        public country: string,
        public website: string,
        public exchange: string,
        public reportingCurrency: string,
        public investableInstrument: number[]
    ) { super(name, alias, _id); }
}