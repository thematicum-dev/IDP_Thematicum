import {DataDistributionModel} from "./dataDistributionModel";
import {UserFundAllocationModel} from "./userFundAllocationModel";
import {ThemeFundCompositionModel} from "./themeFundCompositionModel";

export class ThemeFundCompositionAllocationModel {
    isAllocationEditable: boolean;
    constructor(
        public exposures: DataDistributionModel[],
        public userFundAllocation: UserFundAllocationModel,
        public themeFundComposition: ThemeFundCompositionModel,
        public totalCount: number) {
        this.isAllocationEditable = false;
    }

    public toggleIsAllocationEditable() {
        this.isAllocationEditable = !this.isAllocationEditable;
    }
}