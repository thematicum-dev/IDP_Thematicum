export class ThemeStockCompositionAllocationModel {
    exposureDistribution: any[];
    currentUserAllocation: any;
    isAllocationEditable: boolean = false;
    constructor(
        public themeStockCompositionId: string,
        public stockName: string,
        public stockCountry: string,
        public addedAt: string,
        public isValidated: boolean
    ) {}
}