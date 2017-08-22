import { Component, Input, Output, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
@Component({
        selector: 'app-delete-theme',
        providers: [ThemeService],
        template: `<a class="btn center-block" ng-class="{true: 'btn-primary', false: 'btn-danger'}[!patient.archived]" (click)="deleteTheme($event)"> <span >Delete Theme</span></a>`,
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

        constructor(private themeService: ThemeService) { }

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

        deleteTheme($event) {
                this.themeService.deleteThemeByAdmin(this.userEmail, this.themeId).subscribe(results => this.reactToData(results));
        }
}