import {Theme} from "./theme";

export class ThemeCreationModel {
    constructor(
        public theme: Theme,
        public timeHorizon: string,
        public maturity: string,
        public categories: string[]
    ) {}
}