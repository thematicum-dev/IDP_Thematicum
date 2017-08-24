import { Component, Input, Output, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import {ModalComponent} from "./modal.component";
import {Location} from '@angular/common';

@Component({
        selector: 'app-delete-theme',
        providers: [ThemeService],
        templateUrl: 'delete-theme.component.html',
        styles: [`
        .Follow-this-theme {
                width: 128px;
                height: 36px;
                font-family: DroidSans;
                font-size: 16px;
                line-height: 2.25;
                text-align: center;
                color: #2980b9;
        }
        .Follow-button {
                width: 230px;
                height: 50px;
                border: solid 1px #2980b9;
        }
  `]
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