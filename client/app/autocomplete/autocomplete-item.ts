export class AutocompleteItem {
    constructor(
        public name: string,
        public alias?: string,
        public id?: string,
        public selected: boolean = false
    ) {}
}