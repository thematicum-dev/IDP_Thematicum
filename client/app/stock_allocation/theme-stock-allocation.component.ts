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
            border-color: black;
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
    exposures = ['Strongly Positive', 'Weakly Positive', 'Neutral', 'Weakly Negative', 'Strongly Negative'];
    editedExposure: any;

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

    toggleStockAllocationEditable(allocationModel: ThemeStockCompositionAllocationModel) {
        allocationModel.isAllocationEditable = !allocationModel.isAllocationEditable;
    }

    getExposureDistributionStr(percentage: number, nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `${percentage}% (${nrUsers} user${trailingS})`;
    }

    createOrUpdateStockAllocation(allocationModel: ThemeStockCompositionAllocationModel, exposure: number) {
        console.log('Selected exposure: ', exposure)
        if(allocationModel.currentUserAllocation) {
            //update user's stock allocation
            this.themeService.updateUserStockAllocation(allocationModel.currentUserAllocation._id, exposure).subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    console.log(error);
                }
            )
        } else {
            //create new stock allocation by user
            this.themeService.createUserStockAllocation(allocationModel.themeStockCompositionId, exposure).subscribe(
                data => console.log(data),
                error => console.log(error)
            );
        }
    }

    deleteUserStockAllocation(modal: ModalComponent) {
        let allocationId = modal.getData();
        console.log('allocationId', allocationId);
        this.themeService.deleteUserStockAllocation(allocationId).subscribe(
            data => console.log(data),
            error => console.log(error)
        );
        modal.hide();
    }
}