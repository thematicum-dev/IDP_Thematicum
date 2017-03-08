export class AutocompleteItem {
    constructor(
        public name: string,
        public alias?: string,
        public _id?: string,
        public selected: boolean = false
    ) {}
}