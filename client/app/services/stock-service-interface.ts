import {StockModel} from "../models/stockModel";
export interface StockServiceInterface {
    createStock(stock: StockModel);
}