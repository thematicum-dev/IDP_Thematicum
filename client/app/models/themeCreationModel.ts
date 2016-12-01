import {Theme} from "./theme";

export class ThemeCreationModel {
    constructor(
        public theme: Theme,
        public timeHorizon?: number,
        public maturity?: number,
        public categories?: number[]
    ) {}
}