import {Component, OnInit} from '@angular/core';
import {ModalComponent} from "../theme_details/modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";
import {Input} from "@angular/core/src/metadata/directives";
import {Observable, Observer} from "rxjs";
import {ThemeStockCompositionAllocationModel} from "./theme-stock-composition-allocation-model";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {ThemeService} from "../services/theme.service";

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
    stockAllocationModel: ThemeStockCompositionAllocationModel[] = [];
    stockIds: string[]; //to prefilter stocks available in autocomplete
    addOtherStocks: boolean = false;

    stockAllocationData: any = [];

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {
        this.themeService.getThemeStockAllocationDistribution(this.themeId)
            .subscribe(data => {
                console.log('Stock Allocation Data');
                console.log(data);
                this.stockAllocationData = data; //TODO: define model
            }, error => console.log(error));
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

    toggleAddOtherStocks() {
        this.addOtherStocks = !this.addOtherStocks;
    }

    getExposureDistributionStr(nrUsers: number) {
        let trailingS = nrUsers != 1 ? 's' : '';
        return `(${nrUsers} user${trailingS})`;
    }

    createOrUpdateStockAllocation(allocationModel: any, exposure: number) {
        console.log('Selected exposure: ', exposure)
        //create or update, depending on whether the user has an existing allocation for the given theme-stock composition
        let modelChangedObservable: Observable<any> = allocationModel.userStockAllocation ?
            this.themeService.updateUserStockAllocation(allocationModel.userStockAllocation._id, exposure) :
            this.themeService.createUserStockAllocation(allocationModel.themeStockComposition._id, exposure);

        modelChangedObservable.subscribe(
            data => {
                console.log(data)
                //reload model
                //TODO: other/better way to do this
                this.themeService.getThemeStockAllocationDistribution(this.themeId)
                    .subscribe(results => {
                        console.log('Stock Allocation Data');
                        console.log(results);
                        this.stockAllocationData = results; //TODO: define model
                    }, error => console.log(error));


            },
            error => console.log(error)
        );
    }

    deleteUserStockAllocation(modal: ModalComponent) {
        let allocationId = modal.getData();
        console.log('allocationId', allocationId);
        this.themeService.deleteUserStockAllocation(allocationId).subscribe(
            data => {
                console.log(data)

                //reload model
                //TODO: other/better way to do this
                this.themeService.getThemeStockAllocationDistribution(this.themeId)
                    .subscribe(data => {
                        console.log('Stock Allocation Data');
                        console.log(data);
                        this.stockAllocationData = data; //TODO: define model
                    }, error => console.log(error));
            },
            error => console.log(error)
        );
        modal.hide();
    }

    createStockCompositionAndAllocation(allocations: any[]) {
        let allocationsArray = allocations.map(allocation => new StockAllocationModel(allocation.stock.id, allocation.exposure));
        this.themeService.createManyStockCompositionsAndAllocations(this.themeId, allocationsArray).subscribe(
            data => {
                console.log(data)
                this.toggleAddOtherStocks();
                this.getJoinedObservable()
                    .subscribe(
                        (results: any) => {
                            //this.handleResults(results);

                            //TODO: refactor
                            this.themeService.getThemeStockAllocationDistribution(this.themeId)
                                .subscribe(data => {
                                    console.log('Stock Allocation Data');
                                    console.log(data);
                                    this.stockAllocationData = data; //TODO: define model
                                }, error => console.log(error));
                        },
                        (error) => console.log(error)
                    );
            },
            error => {
                console.log(error)
            }
        );
    }

    getJoinedObservable() {
        // let stockCompositions =  this.themeService.getThemeStockCompositions(this.themeId);
        let allocationDistribution = this.themeService.getThemeStockAllocationDistribution(this.themeId);
        // let userAllocations = this.themeService.getThemeStockAllocationByUser(this.themeId);

        // return Observable.forkJoin([stockCompositions, allocationDistribution, userAllocations]);
        return allocationDistribution;
    }
}