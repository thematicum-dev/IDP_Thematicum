import {Theme} from "./theme";
import {Stock} from "./stock";
export class ThemeStockCompositionModel {
    constructor(public _id: string, public theme: Theme, public stock: Stock) {}
}