import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {FundModel} from "../models/fundModel";
import {searchDisabled_IM} from "../models/IMultiSelectSettings";
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import {FundService} from "../services/fund.service";

@Component({
    selector: 'app-fund-create',
    templateUrl: 'fund-field.component.html',
})
export class FundCreateComponent implements OnInit{

    isCreate: boolean = true;
    currentFund: FundModel;
    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    formCancelled: boolean = false;
    fundAddedSuccessfully: boolean = false;

    @Output() fundCreated: EventEmitter<FundModel> = new EventEmitter<FundModel>();

    constructor(private fundService: FundService) {}

    ngOnInit(): void {
        this.currentFund = new FundModel(
            "", "", "", ""
        );
        this.fundAddedSuccessfully = false;
    }

    onSubmit(form: NgForm) {
        this.fundService.createFund(this.currentFund).subscribe(this.handleResults, this.handleError);
    }

    isFormIncomplete(){
        if( this.isDefined(this.currentFund.name) &&
            this.isDefined(this.currentFund.parent) &&
            this.isDefined(this.currentFund.isin)) {
            return false;
        }
        return true;
    }

    handleResults = (data: FundModel) => {
        this.fundAddedSuccessfully = true;
        this.fundCreated.emit(data);
        this.cancelForm();
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }

    cancelForm(){
        this.formCancelled = true;
    }

    isDefined(variable: any){
        if(typeof variable === 'undefined' || (typeof variable !== 'undefined' && variable.length == 0))
            return false;
        return true;
    }

}