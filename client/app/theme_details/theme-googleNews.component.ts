import {Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from "../services/theme.service";
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from "rxjs";
import {RealtimeNewsModel} from "../models/realtimeNewsModel";

declare var trends: any;

@Component({
    selector: 'app-googleNews',
    templateUrl: 'theme-googleNews.component.html',
    styles: [
        `
            /* Style the tab */
            .tab {
                overflow: hidden;
                border: 1px solid #ccc;
                background-color: #f1f1f1;
            }

            /* Style the buttons inside the tab */
            .tab button {
                background-color: inherit;
                float: left;
                border: none;
                outline: none;
                cursor: pointer;
                padding: 14px 16px;
                transition: 0.3s;
                font-size: 17px;
            }

             /*Change background color of buttons on hover */
            .tab button:hover {
                background-color: #ddd;
            }
            
            .borderless {
                padding: 0;
                border: none;
                background: none
            }

            .noDisplay {
                display: none
            }
            /* Create an active/current tablink class */
            .tab button.active {
                background-color: #ccc;
            }

            /* Style the tab content */
            .tabcontent {
                display: none;
                padding: 6px 12px;
                border: 1px solid #ccc;
                border-top: none;
            }    
        .chart {height: 50%; background: white;}
        #trends-widget-1 {height: 100%; width: 100%;}
        `]

})

export class ThemeGoogleNewsComponent implements OnInit {
    @Input() themeId: string;

    constructor(private themeService : ThemeService) {}

    recentNews = new Array<RealtimeNewsModel>();
    relevantNews = new Array<RealtimeNewsModel>();

    displayMostRecent: boolean = true;

    ngOnInit(): void {

        this.loadRecentNews();
        this.loadRelevantNews();

        // this.themeService.getRealtimeNews(this.themeId).subscribe((data) => {
        //
        //     for (let entry of data) {
        //         let newsdata = new RealtimeNewsModel(entry["_id"], entry["author"], entry["description"], entry["url"],
        //             entry["urlToImage"], entry["title"], entry["source"], entry["publishedAt"], entry["relevancyRanking"],
        //             entry["userVoted"]);
        //         this.recentNews.push(newsdata);
        //     }
        //
        //     console.log(this.recentNews);
        // });
        //
        // this.themeService.getRelevantNews(this.themeId).subscribe((data) => {
        //
        //     for (let entry of data) {
        //         let newsdata = new RealtimeNewsModel(entry["_id"], entry["author"], entry["description"], entry["url"],
        //             entry["urlToImage"], entry["title"], entry["source"], entry["publishedAt"], entry["relevancyRanking"],
        //             entry["userVoted"]);
        //         this.relevantNews.push(newsdata);
        //     }
        //
        //     console.log(this.relevantNews);
        // });


        // document.getElementById("defaultOpen").click();
    }

    loadRecentNews() {
        this.recentNews = new Array<RealtimeNewsModel>();
        this.themeService.getRealtimeNews(this.themeId).subscribe((data) => {
            for (let entry of data) {
                let newsdata = new RealtimeNewsModel(entry["_id"], entry["author"], entry["description"], entry["url"],
                    entry["urlToImage"], entry["title"], entry["source"], entry["publishedAt"], entry["relevancyRanking"],
                    entry["userVoted"]);
                this.recentNews.push(newsdata);
            }

            console.log(this.recentNews);
        });
    }

    loadRelevantNews() {
        this.relevantNews = new Array<RealtimeNewsModel>();
        this.themeService.getRelevantNews(this.themeId).subscribe((data) => {
            for (let entry of data) {
                let newsdata = new RealtimeNewsModel(entry["_id"], entry["author"], entry["description"], entry["url"],
                    entry["urlToImage"], entry["title"], entry["source"], entry["publishedAt"], entry["relevancyRanking"],
                    entry["userVoted"]);
                this.relevantNews.push(newsdata);
            }

            console.log(this.relevantNews);
        });
    }

    onUserLike(newsId) {
        console.log(newsId);
        this.themeService.markNewsAsRelevant(newsId).subscribe();


        let _this = this;
        window.setTimeout(function() {_this.loadRecentNews(); _this.loadRelevantNews()}, 500);
    }

    toggleDisplayTab() {
        this.displayMostRecent = !this.displayMostRecent;
    }

}