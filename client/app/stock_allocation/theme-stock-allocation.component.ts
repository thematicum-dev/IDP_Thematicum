import {Component, OnInit} from '@angular/core';
import {ModalComponent} from "../theme_details/modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";
import {Input} from "@angular/core/src/metadata/directives";
import {Observable, Observer} from "rxjs";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {ThemeService} from "../services/theme.service";
import {ThemeStockCompositionAllocationModel} from "../models/themeStockCompositionAllocationModel";

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
    allocatedStockIds: string[]; //to prefilter stocks available in autocomplete
    showAddOtherStocksButton: boolean = false; //to show/hide "Add Other Stocks" button
    stockAllocationData: ThemeStockCompositionAllocationModel[] = []; //to hold data received from the service

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {
        this.getComponentDataObservable()
            .subscribe(this.handleResults, this.handleError);
    }

    setExposureBackgroundColor(index: number) {
        let exposureBackgroundColors = ['#52BE80', '#ABEBC6', '#FFFFFF', '#F2D7D5', '#D98880']
        return exposureBackgroundColors[index];
    }

    toggleStockAllocationEditable(allocationModel: ThemeStockCompositionAllocationModel) {
        //TODO: delegation causes errors
        allocationModel.isAllocationEditable = !allocationModel.isAllocationEditable;
    }

    toggleShowAddOtherStocksButton() {
        this.showAddOtherStocksButton = !this.showAddOtherStocksButton;
    }

    getExposureDistributionStr(nrUsers: number) {
        const trailingS = nrUsers != 1 ? 's' : '';
        return `(${nrUsers} user${trailingS})`;
    }

    createOrUpdateStockAllocation(allocationModel: ThemeStockCompositionAllocationModel, exposure: number) {
        //create or update, depending on whether the user has an existing allocation for the given theme-stock composition
        const modelChangedObservable: Observable<any> = allocationModel.userStockAllocation ?
            this.themeService.updateUserStockAllocation(allocationModel.userStockAllocation._id, exposure) :
            this.themeService.createUserStockAllocation(allocationModel.themeStockComposition._id, exposure);

        modelChangedObservable.flatMap(data => {
            console.log(data);
            return this.getComponentDataObservable(); //reload model
        }).subscribe(this.handleResults, this.handleError);
    }

    deleteUserStockAllocation(modal: ModalComponent) {
        const allocationId = modal.getData();
        modal.hide();
        this.themeService.deleteUserStockAllocation(allocationId)
            .flatMap(data => {
                console.log(data);
                return this.getComponentDataObservable(); //reload model
            })
            .subscribe(this.handleResults, this.handleError);
    }

    createStockCompositionAndAllocation(allocations: StockAllocationModel[]) {
        this.toggleShowAddOtherStocksButton();
        this.themeService.createManyStockCompositionsAndAllocations(this.themeId, allocations)
            .flatMap(data => {
                console.log(data);
                return this.getComponentDataObservable(); //reload model
            })
            .subscribe(this.handleResults, this.handleError);
    }

    getComponentDataObservable() {
        return this.themeService.getThemeStockAllocationDistribution(this.themeId);
    }

    handleResults = (data: ThemeStockCompositionAllocationModel[]) => {
        console.log('Stock Allocations');
        console.log(data);
        this.stockAllocationData = data;
        this.allocatedStockIds = data.map(allocation => allocation.themeStockComposition.stock._id); //set allocated stock Ids
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }
}