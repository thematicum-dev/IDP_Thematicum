import {ThemeFundCompositionModel} from "./themeFundCompositionModel";

export class UserFundAllocationModel {
    constructor(public _id: string, public themeFundComposition: ThemeFundCompositionModel, public exposure: number) {}
}