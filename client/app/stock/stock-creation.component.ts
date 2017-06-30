import {Component, OnInit} from '@angular/core';
import {StockModel} from "../models/stockModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
    selector: 'app-stock-create',
    templateUrl: 'stock-creation.component.html',
})
export class StockCreationComponent implements OnInit{
    constructor() {}

    ngOnInit(): void { 

    }
}