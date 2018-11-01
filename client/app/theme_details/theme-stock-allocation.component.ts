import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ModalComponent} from "./modal.component";
import {Observable} from "rxjs";
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
        button.no-decoration-element, label.no-decoration-element:hover, label.no-decoration-element:focus {
            background-color: white;
            text-decoration: none;
            outline:none;
            border: none;
            box-shadow: none;
        }
        .btn.active {
            background-color: #d9edf7;
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
    selectedExposure: number; //to hold the exposure value edited by the user
    isCurrentUserAdmin: boolean = localStorage.getItem("isAdmin") == "true";
    
    @ViewChild(ModalComponent)
    public modal: ModalComponent;

    //colors listed from strongly-positive to strongly-negative exposures
    readonly exposureBackgroundColors = [
        {name: 'STRONGLY_POSITIVE_EXPOSURE_COLOR', r:39, g:174, b:96},
        {name: 'WEAKLY_POSTIVE_EXPOSURE_COLOR', r: 26, g:188, b:156},
        {name: 'NETURAL_EXPOSURE_COLOR', r:41, g:128, b:185},
        {name: 'WEAKLY_NEGATIVE_EXPOSURE_COLOR', r:155, g:89, b:182},
        {name: 'STRONGLY_NEGATIVE_EXPOSURE_COLOR', r:192, g:57, b:43}];

    readonly BORDER_EXPOSURE = 'solid 2px #34495e';

    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {
        this.getComponentDataObservable()
            .subscribe(this.handleResults, this.handleError);
    }

    setExposureBackgroundColor(isAllocationEditable: boolean, exposureIndex: number, percentage: number) {
        if (isAllocationEditable) {
            if(exposureIndex == this.selectedExposure){
                const backgroundColor = this.exposureBackgroundColors[exposureIndex];
                return `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`;
            }
            return "transparent";
        }
        const backgroundColor = this.exposureBackgroundColors[exposureIndex];
        return `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${(percentage+5)/100})`;
    }

    setBorderColor(isAllocationEditable: boolean, exposureIndex: number){
        if(!isAllocationEditable){
            return;
        }
        else{
            const backgroundColor = this.exposureBackgroundColors[exposureIndex];
            return `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`;
        }
    }

    setBorder(isAllocationEditable: boolean, exposureIndex: number){
        if(!isAllocationEditable){
            return "0 none";
        }
        else{
            return "1px solid";
        }
    }

    setBottomBorder(allocationModel: ThemeStockCompositionAllocationModel, exposureIndex: number) {
        return allocationModel.userStockAllocation && allocationModel.userStockAllocation.exposure == exposureIndex ? this.BORDER_EXPOSURE : "0 none";
    }

    setLabelColor(exposureIndex: number){
        const backgroundColor = this.exposureBackgroundColors[exposureIndex];
        return `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`;
    }

    setDataToggleAttribute(isAllocationEditable: boolean) {
        return isAllocationEditable ? 'buttons' : '';
    }

    toggleStockAllocationEditable(allocationModel: ThemeStockCompositionAllocationModel) {
        //TODO: delegation causes errors
        allocationModel.isAllocationEditable = !allocationModel.isAllocationEditable;
    }

    clearEditing(allocationModel: ThemeStockCompositionAllocationModel, containerDiv: Element) {
        this.toggleStockAllocationEditable(allocationModel);
        this.selectedExposure = null;

        if(!containerDiv) {
            return;
        }

        //remove active class from labels
        let labels = containerDiv.querySelectorAll('label.active');
        for (let i = 0; i<labels.length; i++) {
            labels[i].classList.remove('active');
        }
    }

    selectExposure(exposure: number) {
        this.selectedExposure = exposure;
    }

    toggleShowAddOtherStocksButton() {
        this.showAddOtherStocksButton = !this.showAddOtherStocksButton;
    }

    getExposureDistributionStr(nrUsers: number) {
        const trailingS = nrUsers != 1 ? 's' : '';
        return `(${nrUsers} user${trailingS})`;
    }

    createOrUpdateStockAllocation(allocationModel: ThemeStockCompositionAllocationModel) {
        if (!this.selectedExposure) return;

        //create or update, depending on whether the user has an existing allocation for the given theme-stock composition
        const modelChangedObservable: Observable<any> = allocationModel.userStockAllocation ?
            this.themeService.updateUserStockAllocation(allocationModel.userStockAllocation._id, this.selectedExposure) :
            this.themeService.createUserStockAllocation(allocationModel.themeStockComposition._id, this.selectedExposure);

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

    deleteUserStockCompositionAdmin(modal: ModalComponent) {       
        const compositionId = modal.getData().themeStockComposition._id; 
        console.log(modal);
        console.log(compositionId);                
        modal.hide();
        this.themeService.deleteUserStockCompositionByAdmin(compositionId)
            .flatMap(data => {
                console.log(data);
                return this.getComponentDataObservable(); //reload model
            })
            .subscribe(this.handleResults, this.handleError);
    }

    toggleStockCompositionValidation(allocationModel: ThemeStockCompositionAllocationModel){
        const compositionId = allocationModel.themeStockComposition._id;
        if(allocationModel.themeStockComposition.isValidated == true){
            this.themeService.validateStockCompositionByAdmin(compositionId, false)
            .flatMap(data => {
                console.log(data);
                return this.getComponentDataObservable(); //reload model
            })
            .subscribe(this.handleResults, this.handleError);
        } else if(allocationModel.themeStockComposition.isValidated == false){
            this.themeService.validateStockCompositionByAdmin(compositionId, true)
            .flatMap(data => {
                console.log(data);
                return this.getComponentDataObservable(); //reload model
            })
            .subscribe(this.handleResults, this.handleError);
        }
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
        console.log("Stock ko data" + this.stockAllocationData);
        //this.stockAllocationData.userInputs.updatedAt = new Date(this.stockAllocationData.userInputs.updatedAt).toLocaleString();
        this.allocatedStockIds = data.map(allocation => allocation.themeStockComposition.stock._id); //set allocated stock Ids
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }
}