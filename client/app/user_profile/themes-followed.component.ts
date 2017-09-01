import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '../models/theme';
import { UserProfileService } from '../services/user-profile.service';

@Component({
    selector: 'app-user-themes-followed',
    templateUrl: 'themes-followed.component.html',
    providers: [UserProfileService],
    styles: [`
        .nobullet {
        list-style-type: none;
        }
    `]
})

export class ThemesFollowedComponent implements OnInit {

    constructor(private userProfileService: UserProfileService) { }
    themes: Theme[] = []

    ngOnInit(): void {
      this.userProfileService.getThemesOfAUser().subscribe(themes =>this.setThemes(themes));
    }    

    setThemes = (themes: Theme[]) => {
        console.log(themes);
        this.themes = themes;
    }
}