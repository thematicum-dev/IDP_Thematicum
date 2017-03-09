import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Theme} from "../models/theme";
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {ThemeService} from "../services/theme.service";
import {ModalComponent} from "./modal.component";
import {ViewChild} from "@angular/core/src/metadata/di";

@Component({
    selector: 'app-theme-details',
    templateUrl: 'theme-details.component.html',
    styles: [`
        .well button.btn-default {
            background-color: #f5f5f5;
            text-decoration: none;
            outline:none;
            border: none;
            box-shadow: none;
        }
        .modal {
          background: rgba(0,0,0,0.6);
        }
        `]
})
export class ThemeDetailsComponent implements OnInit, OnChanges {
    theme: Theme; //theme retrieved from the service
    selectedThemeId: string; //theme Id retrieved from the url
    isEditMode = false; //to show/hide theme-editing form

    @ViewChild(ModalComponent)
    public modal: ModalComponent;

    constructor(private route: ActivatedRoute, private router: Router, private themeService: ThemeService) { }

    ngOnInit(): void {
        if(!this.route.snapshot.params['id']) {
            return;
        }

        this.selectedThemeId = this.route.snapshot.params['id'];
        this.themeService.getThemeById(this.selectedThemeId).subscribe(
            data => {
                console.log('Theme');
                console.log(data);
                this.theme = data;
            },
            error => console.log('Error: ', error));
    }

    ngOnChanges(changes: SimpleChanges): void {}

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    onThemeChanged(theme: Theme) {
        this.theme = theme;
        this.isEditMode = false;
    }

    deleteTheme(modal: any) {
        modal.hide();
        this.themeService.deleteTheme(this.selectedThemeId).subscribe(
            data => {
                console.log(data);
                this.router.navigate(['/search']);
            },
            error => console.log(error));
    }
}