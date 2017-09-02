import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '../models/theme';
import { UserProfileService } from '../services/user-profile.service';
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-user-themes-followed',
    templateUrl: 'themes-followed.component.html',
    providers: [UserProfileService],
    styles: [`
        .nobullet {
            list-style-type: none;
        }
        .themename {
            line-height: 50px;
        }
        .theme-row-margin{
            margin-bottom: 1px;
        }
    `]
})

export class ThemesFollowedComponent implements OnInit {

    constructor(private userProfileService: UserProfileService, private themeService: ThemeService) { }
    themes: Theme[] = []
    themePropertiesData: any[] = []; //to hold data received from the service

    ngOnInit(): void {
      this.userProfileService.getThemesOfAUser().subscribe(themes =>this.setThemes(themes));
    }    

    setThemes = (themes: Theme[]) => {
        var that = this;
        this.themes = themes;
        this.themes.forEach(function(theme) {
            that.getThemeProperties(theme._id);
        });
    }

    getThemeProperties(themeId) {
        this.themeService.getThemeProperties(themeId).subscribe(this.handleResults, this.handleError);
    }

    handleResults = (data: any) => {
        this.themePropertiesData[data.themeId] = data;
    }

    handleError = (error: any) => {
        console.log('Error: ' + error);
    }
}