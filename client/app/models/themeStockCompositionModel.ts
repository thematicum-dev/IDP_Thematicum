import {Theme} from "./theme";
import {StockModel} from "./stockModel";
export class ThemeStockCompositionModel {
    constructor(public _id: string, public theme: Theme, public stock: StockModel) {}
}