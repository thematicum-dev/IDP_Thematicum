import {Theme} from "./theme";
import {ThemeProperties} from "./themeProperties";
import {StockAllocation} from "./stockAllocation";
import {StockAllocationModel} from "./stockAllocationModel";

export class ThemeCreationModel {
    public theme: Theme;
    public themeProperties: ThemeProperties;
    public stockAllocation: StockAllocationModel[];
    constructor() {
        this.theme = new Theme();
        this.themeProperties = new ThemeProperties();
        this.stockAllocation = [];
    }
}