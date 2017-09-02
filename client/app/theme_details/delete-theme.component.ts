import { Component, Input, Output, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import {ModalComponent} from "./modal.component";
import {Location} from '@angular/common';

@Component({
        selector: 'app-delete-theme',
        providers: [ThemeService],
        templateUrl: 'delete-theme.component.html'
})

export class DeleteThemeComponent implements OnInit {

        constructor(private themeService: ThemeService, private location: Location) { }

        follow: boolean = false;

        @Input('userEmail')
        userEmail: string;

        @Input('themeId')
        themeId: string;

        reactToData(results) {
                console.log(results);
        }

        ngOnInit(): void {
        }

        deleteTheme(modal: ModalComponent) {
                this.themeService.deleteThemeByAdmin(this.userEmail, this.themeId).subscribe(results => {
                        this.reactToData(results);                        
                        modal.hide();
                        this.location.back();
                });
        }
}