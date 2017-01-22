import {Component, OnInit} from '@angular/core';
import {ModalComponent} from "../theme_details/modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import {Input} from "@angular/core/src/metadata/directives";
import {Observable} from "rxjs";
import {ThemeStockCompositionAllocationModel} from "./theme-stock-composition-allocation-model";
@Component({
    selector: 'app-theme-stock-allocation',
    templateUrl: 'theme-stock-allocation.component.html',
    providers: [ThemeSearchService],
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
export class ThemeStockAllocationComponent implements OnInit {
    @Input() themeId: string;
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
    isStockAllocationEditable: boolean = false;

    stockAllocationModel: ThemeStockCompositionAllocationModel[] = [];

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(private themeService: ThemeSearchService) {}

    ngOnInit(): void {
        let stockCompositions =  this.themeService.getThemeStockCompositions(this.themeId);
        let allocationDistribution = this.themeService.getThemeStockAllocationDistribution(this.themeId);
        let userAllocations = this.themeService.getThemeStockAllocationByUser(this.themeId);

        Observable.forkJoin([stockCompositions, allocationDistribution, userAllocations]).subscribe(
            (results: any) => {
                console.log('results: ', results);
                let _stockCompositions = results[0];
                let _allocationDistribution = results[1];
                let _userAllocations = results[2];

                //expected equal length
                if (_stockCompositions.length != _allocationDistribution.length) {
                    return;
                }

                this.stockAllocationModel = _stockCompositions.map(function (composition, index, array) {
                    let model = new ThemeStockCompositionAllocationModel(
                        composition._id,
                        composition.stock.companyName,
                        composition.stock.country,
                        composition.addedAt,
                        composition.isValidated);
                    model.exposureDistribution = _allocationDistribution[index].exposureDistribution;

                    let userInputForStockComposition = _userAllocations.filter(function(item) {
                        return item.themeStockComposition._id == composition._id;
                    });

                    if(userInputForStockComposition && userInputForStockComposition.length > 0) {
                        model.currentUserAllocation = userInputForStockComposition[0];
                    }

                    return model;
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    setExposureBackgroundColor(index: number) {
        let exposureBackgroundColors = ['#52BE80', '#ABEBC6', '#FFFFFF', '#F2D7D5', '#D98880']
        return exposureBackgroundColors[index];
    }

    setStockBackground(index: number) {
        return index % 2 == 0 ? '#F8F9F9' : 'white';
    }

    toggleStockAllocationEditable() {
        this.isStockAllocationEditable = !this.isStockAllocationEditable;
    }
}