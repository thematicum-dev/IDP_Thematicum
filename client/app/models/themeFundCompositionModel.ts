import {Theme} from "./theme";
import {FundModel} from "./fundModel";
export class ThemeFundCompositionModel {
    constructor(public _id: string, public theme: Theme, public fund: FundModel, public isValidated: boolean) {}
}