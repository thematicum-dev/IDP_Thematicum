import {DataDistributionModel} from "./dataDistributionModel";
import {ThemeStockCompositionModel} from "./themeStockCompositionModel";
import {UserStockAllocationModel} from "./userStockAllocationModel";

export class ThemeStockCompositionAllocationModel {
    isAllocationEditable: boolean;
    constructor(
        public exposures: DataDistributionModel[],
        public userStockAllocation: UserStockAllocationModel,
        public themeStockComposition: ThemeStockCompositionModel) {
        this.isAllocationEditable = false;
    }

    public toggleIsAllocationEditable() {
        this.isAllocationEditable = !this.isAllocationEditable;
    }
}