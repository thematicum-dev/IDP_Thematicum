import {Component, Input, OnInit} from '@angular/core';
import {ThemeService} from "../services/theme.service";
import {GoogleCustomSearchModel} from "../models/googleCustomSearchModel";

@Component({
    selector: 'app-google-reports',
    templateUrl: 'theme-google-custom-search.component.html',
    styles: [
        `
        .borderless {
            padding: 0;
            border: none;
            background: none
        }

        .noDisplay {
            display: none
        }
        .chart {height: 50%; background: white;}
        #trends-widget-1 {height: 100%; width: 100%;}
        `]

})

export class ThemeGoogleReportsComponent implements OnInit {
    @Input() themeId: string;

    constructor(private themeService : ThemeService) {}

    reportsSortedByRelevancy = new Array<GoogleCustomSearchModel>();
    reportsSortedByDate = new Array<GoogleCustomSearchModel>();

    displayMostRecent: boolean = true;

    ngOnInit(): void {
        this.loadReports();
    }

    loadReports() {
        this.themeService.getReportsByThemeId(this.themeId).subscribe((data) => {

            console.log("Reports");

            this.reportsSortedByRelevancy = new Array<GoogleCustomSearchModel>();
            for (let entry of data) {
                let report = new GoogleCustomSearchModel(entry["_id"], entry["snippet"], entry["link"], entry["title"],
                    entry["displayLink"], entry['relevancyRanking'], entry['userUpVoted'], entry['userDownVoted']);
                this.reportsSortedByRelevancy.push(report);
            }
            console.log(this.reportsSortedByRelevancy);
            this.reportsSortedByDate = new Array<GoogleCustomSearchModel>();
            this.reportsSortedByDate = Object.assign([], this.reportsSortedByRelevancy);
            this.reportsSortedByDate.sort(this.compareByDate);

            // console.log(this.reportsSortedByRelevancy);
        });
    }

    onUserUpVote(reportId) {
        console.log(reportId);
        this.themeService.performReportUpVote(reportId).subscribe();

        let _this = this;
        window.setTimeout(function() {_this.loadReports()}, 500);
    }

    onUserDownVote(reportId) {
        console.log(reportId);
        this.themeService.performReportDownVote(reportId).subscribe();

        let _this = this;
        window.setTimeout(function() {_this.loadReports()}, 500);
    }

    compareByDate(a,b) {
        if (a._id > b._id)
            return -1;
        if (a._id < b._id)
            return 1;
        return 0;
    }

    compareByRelevancy(a,b) {
        if (a.tfidfRanking + a.relevancyRanking > b.tfidfRanking + b.relevancyRanking)
            return -1;
        if (a.tfidfRanking + a.relevancyRanking < b.tfidfRanking + b.relevancyRanking)
            return 1;
        if (a.tfidfRanking + a.relevancyRanking === b.tfidfRanking + b.relevancyRanking)
            return this.compareByDate(a,b);
        return 0;
    }

    toggleDisplayTab() {
        this.displayMostRecent = !this.displayMostRecent;
    }

    goToLink(url: string){
        window.open(url, "_blank");
    }
}