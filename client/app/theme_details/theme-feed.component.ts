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

        var stringModifier = this.theme.name;

        var modifiedString= stringModifier.replace(" ","%20");

        var tempName = "https://trends.google.com:443/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22";
        var tempName2 = modifiedString;
        var tempName3 = "%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%201-m%22%7D%5D%2C%22category%22%3A0%2C%22property%22%3A%22%22%7D&tz=-120&eq=date%3Dtoday%25201-m";

        var endName = tempName.concat(tempName2,tempName3);

        console.log(endName);

        this.modifiedName = endName;
    }

    trendURL() {

        return this.sanitizer.bypassSecurityTrustResourceUrl(this.modifiedName);
    }

}