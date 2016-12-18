import {Theme} from "./theme";
import {ThemeProperties} from "./themeProperties";

export class ThemeCreationModel {
    constructor(
        public theme: Theme,
        public themeProperties: ThemeProperties
        // public timeHorizon?: number,
        // public maturity?: number,
        // public categories?: number[]
    ) {}
}