import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';

export let timeHorizonValues_IM: IMultiSelectOption[] = [
    { name: 'Short term (1 - 6 months)', id: 0},
    { name: 'Medium term (0.5 - 3 years)', id: 1},
    { name: 'Long term (> 3 years)', id: 2}
];

export let maturityValues_IM: IMultiSelectOption[] = [
    { name: 'Upcoming', id: 0},
    { name: 'Nascent', id: 1},
    { name: 'Accelerating', id: 2},
    { name: 'Mature', id: 3},
    { name: 'Declining', id: 4}
];

export let categoryValues_IM: IMultiSelectOption[] = [
    { name: 'Economic', id: 0},
    { name: 'Technologic', id: 1},
    { name: 'Environmental', id: 2},
    { name: 'Political', id: 3},
    { name: 'Regulatory', id: 4},
    { name: 'Sociologic', id: 5}
];

export let stockInvestableValues_IM: IMultiSelectOption[] = [
    { name: 'Public equity (the company is listed at a stock exchange)', id: 0},
    { name: 'Private equity (the company is not listed at a stock exchange i.e. pre-IPO)', id: 1},
    { name: 'Coins or tokens (the company will issue or has issued tradable coins or tokens)', id: 2},
    { name: 'I do not know', id: 3}
];

export let geographyValues_IM: IMultiSelectOption[] = [
    { name: 'North America', id: 0},
    { name: 'South America', id: 1},
    { name: 'Europe', id: 2},
    { name: 'Africa', id: 3},
    { name: 'Asia', id: 4},
    { name: 'Australia', id: 5},
];

export let sectorValues_IM: IMultiSelectOption[] = [
    { name: 'Energy', id: 0},
    { name: 'Basic Materials', id: 1},
    { name: 'Industrials', id: 2},
    { name: 'Consumer', id: 3},
    { name: 'Financials', id: 4},
    { name: 'Healthcare', id: 5},
    { name: 'Technology', id: 6},
    { name: 'Telco', id: 7},
    { name: 'Utilities', id: 8},
];

export let searchDisabled_IM: IMultiSelectSettings = {
        enableSearch: false,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default btn-block overflow no-border-radius',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: true,
        containerClasses: 'full-width',
        showUncheckAll: true
    };

export let searchEnabled_IM: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default btn-block overflow no-border-radius',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: true,
        containerClasses: 'full-width',
        showUncheckAll: true
};

export let categoryTextOptions_IM: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Category',
        allSelected: 'All Selected'
};

export let timeHorizonTextOptions_IM: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Time Horizon',
        allSelected: 'All Selected'
};

export let maturityTextOptions_IM: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Maturity',
        allSelected: 'All Selected'
};

export let tagTextOptions_IM: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Tags',
        allSelected: 'All Selected'
};

export let stockInvestableOptions_IM: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Investable Instruments',
        allSelected: 'All Selected'
};

export let geographyTextOptions_IM: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Search',
    defaultTitle: 'Geography',
    allSelected: 'All Selected'
};

export let sectorTextOptions_IM: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Search',
    defaultTitle: 'Sectors',
    allSelected: 'All Selected'
};