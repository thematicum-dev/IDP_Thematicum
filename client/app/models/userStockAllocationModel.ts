import {ThemeStockCompositionModel} from "./themeStockCompositionModel";
export class UserStockAllocationModel {
    constructor(public _id: string, public themeStockComposition: ThemeStockCompositionModel, public exposure: number) {}
}