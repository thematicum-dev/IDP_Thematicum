import { Component, Input, OnInit } from '@angular/core';
import {FundModel} from "../models/fundModel";

@Component({
    selector: 'app-admin-funds-manager',
    templateUrl: 'admin-funds-manager.component.html',
})

export class AdminFundsManager implements OnInit {

    selectedFund: FundModel;

    ngOnInit(): void {

    }

    searchTermFund(fund: FundModel){
        this.selectedFund = fund;
    }

}