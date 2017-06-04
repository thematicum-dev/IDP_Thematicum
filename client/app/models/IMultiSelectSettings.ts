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

export let searchDisabled_IM: IMultiSelectSettings = {
        enableSearch: false,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default btn-block no-border-radius',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: true,
        containerClasses: 'full-width',
        showUncheckAll: true
    };

export let searchEnabled_IM: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default btn-block no-border-radius',
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