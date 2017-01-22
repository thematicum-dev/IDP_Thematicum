export class ThemeStockCompositionAllocationModel {
    exposureDistribution: any[];
    currentUserAllocation: any;
    constructor(
        public themeStockCompositionId: string,
        public stockName: string,
        public stockCountry: string,
        public addedAt: string,
        public isValidated: boolean
    ) {}
}