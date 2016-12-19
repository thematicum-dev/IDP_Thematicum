import {Theme} from "./theme";
import {ThemeProperties} from "./themeProperties";
import {StockAllocation} from "./stockAllocation";
import {StockAllocationModel} from "./stockAllocationModel";

export class ThemeCreationModel {
    constructor(
        public theme: Theme,
        public themeProperties: ThemeProperties,
        public stockAllocation: StockAllocationModel[] = []
    ) {}
}