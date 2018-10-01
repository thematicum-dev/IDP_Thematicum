import {FundModel} from "../models/fundModel";
export interface FundServiceInterface {
    createFund(stock: FundModel);
}