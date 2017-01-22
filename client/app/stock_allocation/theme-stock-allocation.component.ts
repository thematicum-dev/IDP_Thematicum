import {Component} from '@angular/core';
import {ModalComponent} from "../theme_details/modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";
@Component({
    selector: 'app-theme-stock-allocation',
    templateUrl: 'theme-stock-allocation.component.html',
    styles: [
        `hr {
            margin-top: 0;
        }
        .userAllocatedStock {
            border-style: solid;
            border-width: 2px;
            border-color: #000000;
        }
        .default-cursor {
            cursor: default;
        }
        button.no-decoration-element, label.no-decoration-element:hover, label.no-decoration-element:focus {
            background-color: white;
            text-decoration: none;
            outline:none;
            border: none;
            box-shadow: none;
        }
        label.inactive-element:hover, label.inactive-element:not(:hover), label.inactive-element:focus {
            text-decoration: none;
            outline:none;
            box-shadow: none;
            border-color: #ccc;
            cursor: default;    
        }
        input[type="radio"] {
            visibility:hidden;
        }
        label.inactive-element:hover, label.inactive-element:not(:hover), label.inactive-element:focus {
            text-decoration: none;
            outline:none;
            box-shadow: none;
            border-color: #ccc;
            cursor: default;    
        }
        .open>.dropdown-toggle {
            background: white;
            box-shadow: none;
        }`
    ]
})
export class ThemeStockAllocationComponent {
    stocks: any[] = [
        {name: 'Stock 1 Stock 1 Stock 1', country: 'USA', addedOn: 'Jan 2017', validated: false, userAlloc: true},
        {name: 'Stock 2 Stock 2', country: 'USA', addedOn: 'Dec 2016', validated: true, userAlloc: false},
        {name: 'Stock 3 Stock 3 Stock 3', country: 'USA', addedOn: 'Nov 2016', validated: false, userAlloc: true},
        {name: 'Stock 4 Stock 4', country: 'USA', addedOn: 'Jan 2017', validated: true, userAlloc: false}
        ]

    exposures: any[] = [
        {name: 'Strongly Positive', value: '20%'},
        {name: 'Weakly Positive', value: '20%'},
        {name: 'Neutral', value: '20%'},
        {name: 'Weakly Negative', value: '20%'},
        {name: 'Strongly Negative', value: '20%'}
    ]

    selectedExposure: any;

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    setExposureBackgroundColor(index: number) {
        let exposureBackgroundColors = ['#52BE80', '#ABEBC6', '#FFFFFF', '#F2D7D5', '#D98880']
        return exposureBackgroundColors[index];
    }

    setStockBackground(index: number) {
        return index % 2 == 0 ? '#F8F9F9' : 'white';
    }
}