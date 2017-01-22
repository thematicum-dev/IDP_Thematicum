import {Component, OnInit, OnChanges, SimpleChanges, ElementRef, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {ThemeService} from "../theme_creation/theme.service";
import {ModalComponent} from "./modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";

@Component({
    selector: 'app-theme-details',
    templateUrl: 'theme-details.component.html',
    styles: [`
        h3 {
                margin-top: 0;
            }
            .well button.btn-default {
                background-color: #f5f5f5;
                text-decoration: none;
                outline:none;
                border: none;
                box-shadow: none;
            },
            .modal {
              background: rgba(0,0,0,0.6);
            }
        `],
    providers: [ThemeSearchService]
})
export class ThemeDetailsComponent implements OnInit, OnChanges {
    //theme existing data
    theme: Theme;
    selectedThemeId: string;
    isCreator = true;
    isEditable = false;

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(
        private route: ActivatedRoute,
        private searchService: ThemeSearchService,
        private themeService: ThemeService) { }

    ngOnInit(): void {
        if(!this.route.snapshot.params['id']) {
            return;
        }

        this.selectedThemeId = this.route.snapshot.params['id'];
        this.searchService.getThemeById(this.selectedThemeId).subscribe(
            data => {
                console.log('ThemeId: ', this.selectedThemeId);
                this.theme = data;
                this.theme.createdAt = new Date(data.createdAt);
                //console.log(data)
            },
            error => {
                //TODO: handle error by displaying message
                console.log('Error getting theme data: ', error);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        //TODO: is this needed?
        // var themeChange: Theme = changes.theme.currentValue;
        // if (themeChange) {
        //     //this.autocompleteList.list = this.dataSource;
        // }
    }

    toggleEditable() {
        this.isEditable = !this.isEditable;
    }

    cancelThemeEditing(theme: Theme) {
        //cancel changes made to Theme, by restoring previous model
        this.theme = theme;

        //set isThemeCharacteristicsEditable to false
        this.isEditable = false;
    }

    deleteTheme(modal: any) {
        //TODO: implement DELETE theme
        modal.hide();
    }
}