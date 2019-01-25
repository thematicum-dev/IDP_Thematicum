import {Component, Input, OnInit} from '@angular/core';
import {ThemeService} from "../services/theme.service";
import {NewsModel} from "../models/newsModel";

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

    recentNews = new Array<NewsModel>();
    relevantNews = new Array<NewsModel>();

    displayMostRecent: boolean = true;

    ngOnInit(): void {

        this.loadRecentNews();
        this.loadRelevantNews();
    }

    loadRecentNews() {
        this.themeService.getRealtimeNews(this.themeId).subscribe((data) => {
            this.recentNews = new Array<NewsModel>();
            for (let entry of data) {
                let newsdata = new NewsModel(entry["_id"], entry["author"], entry["description"], entry["url"],
                    entry["urlToImage"], entry["title"], entry["source"], entry["publishedAt"], entry["relevancyRanking"],
                    entry["userUpVoted"], entry["userDownVoted"]);
                this.recentNews.push(newsdata);
            }

            console.log(this.recentNews);
        });
    }

    loadRelevantNews() {
        this.themeService.getRelevantNews(this.themeId).subscribe((data) => {
            this.relevantNews = new Array<NewsModel>();
            for (let entry of data) {
                let newsdata = new NewsModel(entry["_id"], entry["author"], entry["description"], entry["url"],
                    entry["urlToImage"], entry["title"], entry["source"], entry["publishedAt"], entry["relevancyRanking"],
                    entry["userUpVoted"], entry["userDownVoted"]);
                this.relevantNews.push(newsdata);
            }

            console.log(this.relevantNews);
        });
    }

    onUserUpVote(newsId) {
        console.log(newsId);
        this.themeService.performNewsUpVote(newsId).subscribe();


        let _this = this;
        window.setTimeout(function() {_this.loadRecentNews(); _this.loadRelevantNews()}, 500);
    }


    onUserDownVote(newsId) {
        console.log(newsId);
        this.themeService.performNewsDownVote(newsId).subscribe();


        let _this = this;
        window.setTimeout(function() {_this.loadRecentNews(); _this.loadRelevantNews()}, 500);
    }

    toggleDisplayTab() {
        this.displayMostRecent = !this.displayMostRecent;
    }

    goToLink(url: string){
        window.open(url, "blank");
    }

}