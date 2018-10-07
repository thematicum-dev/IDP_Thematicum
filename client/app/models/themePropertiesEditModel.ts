import {categoryValues, geographyValues, sectorValues} from "../models/themePropertyValues";

export class ThemePropertiesEditModel{
    categoryValues = categoryValues;
    categoriesValuesChecked: boolean[];
    geographyValues = geographyValues;
    geographyValuesChecked: boolean[];
    sectorValues = sectorValues;
    sectorValuesChecked: boolean[];

    public timeHorizon: number = null;
    public maturity: number = null;
    public categories: number[];
    public geography: number[];
    public sectors: number[];


    constructor() {
        this.categoriesValuesChecked = Array(this.categoryValues.length).fill(false);
        this.geographyValuesChecked = Array(this.geographyValues.length).fill(false);
        this.sectorValuesChecked = Array(this.sectorValues.length).fill(false);
    }

    setTimeHorizon(timeHorizon: number) {
        this.timeHorizon = timeHorizon;
    }

    setMaturity(maturity: number) {
        this.maturity = maturity;
    }

    toggleCheckedCategory(category: number) {
        this.categoriesValuesChecked[category] = !this.categoriesValuesChecked[category];
    }

    setCheckedCategories() {
        this.categories = this.getCheckedCategories();
    }

    getCheckedCategories() {
        let categories: number[] = [];
        this.categoriesValuesChecked.forEach((value, index) => {
            if (value)
                categories.push(index)
        });
        return categories;
    }

    uncheckAllCategories() {
        this.categoriesValuesChecked.forEach((value, index) => {
            this.categoriesValuesChecked[index] = false;
        });
    }

    toggleCheckedGeography(geography: number) {
        this.geographyValuesChecked[geography] = !this.geographyValuesChecked[geography];
    }

    setCheckedGeographies() {
        this.geography = this.getCheckedGeographies();
    }

    getCheckedGeographies() {
        let geographies: number[] = [];
        this.geographyValuesChecked.forEach((value, index) => {
            if (value)
                geographies.push(index)
        });
        return geographies;
    }

    uncheckAllGeographies() {
        this.geographyValuesChecked.forEach((value, index) => {
            this.geographyValuesChecked[index] = false;
        });
    }

    toggleCheckedSector(sector: number) {
        this.sectorValuesChecked[sector] = !this.sectorValuesChecked[sector];
    }

    setCheckedSectors() {
        this.sectors = this.getCheckedSectors();
    }

    getCheckedSectors() {
        let sectors: number[] = [];
        this.sectorValuesChecked.forEach((value, index) => {
            if (value)
                sectors.push(index)
        });
        return sectors;
    }

    uncheckAllSectors() {
        this.sectorValuesChecked.forEach((value, index) => {
            this.sectorValuesChecked[index] = false;
        });
    }


    clearProperties() {
        this.timeHorizon = null;
        this.maturity = null;
        this.categories = null;
        this.geography = null;
        this.sectors = null;
        this.uncheckAllCategories();
        this.uncheckAllGeographies();
        this.uncheckAllSectors();
    }

    hasNoUserInputs() {
        return this.timeHorizon == null || this.maturity == null || this.getCheckedCategories().length == 0 || this.getCheckedGeographies().length == 0 || this.getCheckedSectors().length == 0;
    }
}