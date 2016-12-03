import {Component, OnInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-theme-details',
    templateUrl: 'theme-details.component.html',
    providers: [ThemeSearchService]
})
export class ThemeDetailsComponent implements OnInit{
    theme: Theme;

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.searchService.getThemeById(params['id']))
            .subscribe((theme: Theme) => this.theme = theme);
    }

    constructor(private route: ActivatedRoute, private router: Router, private searchService: ThemeSearchService) {
        // this.searchService.getThemeById(this.searchTerm.trim())
        //     .subscribe(
        //         data => {
        //             for (var i = 0; i < data.length; i++) {
        //                 this.themes.push(new Theme(
        //                     data[i]._id,
        //                     data[i].name,
        //                     data[i].description));
        //             }
        //         },
        //         error => {
        //             console.log(error)
        //         }
        //     );
    }
}