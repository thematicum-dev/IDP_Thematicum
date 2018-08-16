import {Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from "../services/theme.service";
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

declare var trends: any;

@Component({
    selector: 'app-theme-feed',
    templateUrl: 'theme-feed.component.html',
    styles: [
        `
        .chart {height: 50%; background: white;}
        #trends-widget-1 {height: 100%; width: 100%;}
        `]
    

})

export class ThemeFeedComponent implements OnInit {
    name: string;
    modifiedName: any;
    @Input() themeId: string;
    @Input() theme: Theme;

    constructor(private route: ActivatedRoute, private router: Router, private themeService: ThemeService, private location: Location, private sanitizer: DomSanitizer) { }

    
    
    ngOnInit(): void {

        this.name = this.theme.name;

        console.log(this.theme);
        console.log(this.theme.tags);

        var tags = this.theme.tags;


        var tempName = "https://trends.google.com:443/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B";
        var start = "%7B%22keyword%22%3A%22";
        var next = "%2C";
        var end = "%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%205-y%22%7D";


        tempName = tempName.concat(start,(this.theme.name).replace(" ","%20"),end);

        for(var i=0; i<tags.length; i++) {
            tempName = tempName.concat(next,start,(tags[i]).replace(" ","%20"),end);
        }
        
        tempName = tempName.concat("%5D%2C%22category%22%3A0%2C%22property%22%3A%22%22%7D&tz=-345&eq=date%3Dtoday%25205-y%26q%3D");

        tempName = tempName.concat((this.theme.name).replace(" ","%2520"));

        for(var i=0; i<tags.length; i++) {
            tempName = tempName.concat(next,(tags[i]).replace(" ","%2520"));
        }

        console.log(tempName);

        this.modifiedName = tempName;






    }

    trendURL() {

        return this.sanitizer.bypassSecurityTrustResourceUrl(this.modifiedName);
    }

}
