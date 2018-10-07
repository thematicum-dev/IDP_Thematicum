import {Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {searchDisabled_IM} from "../models/IMultiSelectSettings";
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import {FundModel} from "../models/fundModel";
import {FundService} from "../services/fund.service";

@Component({
    selector: 'app-fund-update',
    templateUrl: 'fund-field.component.html',
})
export class FundUpdateComponent implements OnInit{

    isUpdate: boolean = true;

    currentFund: FundModel;
    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    formCancelled: boolean = false;
    fundUpdatedSuccessfully: boolean = false;
    fundDeletedSuccessfully: boolean = false;
    isFundSelected: boolean = false;

    @Input('fund')
    fund: FundModel;

    constructor(private fundService: FundService) {}

    ngOnInit(): void {
        this.currentFund = new FundModel(
            "", "", "", ""
        );
    }

    onSubmit(form: NgForm) {
        this.fundService.updateFund(this.currentFund).subscribe(this.handleUpdate, this.handleError);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.fund && !changes.fund.firstChange) {
            this.currentFund = this.fund;
            this.isFundSelected = true;
        }
        this.fundUpdatedSuccessfully = false;
        this.fundDeletedSuccessfully = false;
    }

    isUpdateFormIncomplete(){
        if( this.isDefined(this.currentFund._id) &&
            this.isDefined(this.currentFund.name) &&
            this.isDefined(this.currentFund.isin) &&
            this.isDefined(this.currentFund.parent) ) {
            return false;
        }
        return true;
    }

    isDeleteFormIncomplete(){
        if( this.isDefined(this.currentFund._id) &&
            this.isDefined(this.currentFund.name)){
            return false;
        }
        return true;
    }

    handleUpdate = (data: FundModel) => {
        this.fundUpdatedSuccessfully = true;
    }

    handleDelete = (data: FundModel) => {
        this.fundDeletedSuccessfully = true;
        this.currentFund = new FundModel(
            "", "", "", ""
        );
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }

    isDefined(variable: any){
        if(typeof variable === 'undefined' || (typeof variable !== 'undefined' && variable.length == 0))
            return false;
        return true;
    }

    deleteFund(){
        this.fundService.deleteFund(this.currentFund).subscribe(this.handleDelete, this.handleError);
    }
}