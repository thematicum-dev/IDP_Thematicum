import { Component, Input, OnInit } from '@angular/core';
import { UserThemeInput } from '../models/newsFeedModel';
import { NewsFeedModel } from '../models/newsFeedModel';
import { UserThemeStockAllocation } from '../models/newsFeedModel';
@Component({
    selector: 'app-user-feed',
    templateUrl: 'feed.component.html',
    styles: [`
                .newsfeeddiv {
                            border-bottom: 0.5px solid rgb(160,160,255);
                            border-radius: 3px;
                            padding: 15px; 
                            width: auto;
                            margin-bottom: 5px;
                }

                .indent {
                            margin-left: 20px;
                }

                .thick {
                            font-weight: bold;
                }

                .time {
                            color: #95a5a6;
                            font-size: 0.8em;
                            float: right;
                }
            `]
})

export class FeedComponent implements OnInit {
    @Input('newsfeed')
    newsfeed: NewsFeedModel;
    displayTimeHorizon: string;
    displayMaturity: string;
    displayCategories: string;
    displayExposure: string;
    displayGeography: string;

    ngOnInit(): void {
        this.newsfeed.createdAt = new Date(this.newsfeed.createdAt).toLocaleString();
        if (this.newsfeed.userThemeInput != null) {
            var generaltimehorizonArray = ['Short Term ( 1-6 months )', 'Medium Term ( 0.5-3 years )', 'Long Term ( > 3 years )'];
            this.displayTimeHorizon = generaltimehorizonArray[this.newsfeed.userThemeInput.timeHorizon];

            var maturityArray = ['Upcoming', 'Nascent', 'Accelerating', 'Mature', 'Declining'];
            this.displayMaturity = maturityArray[this.newsfeed.userThemeInput.maturity];

            var geographyArray = ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Australia'];
            this.displayGeography = geographyArray[this.newsfeed.userThemeInput.geography];

            var categoriesArray = ['Economic, ', 'Technologic, ', 'Environmental, ', 'Political, ', 'Regulatory, ', 'Sociologic, '];
            this.displayCategories = '';
            for (var i = 0; i < this.newsfeed.userThemeInput.categories.length; i++) {
                this.displayCategories += categoriesArray[this.newsfeed.userThemeInput.categories[i]];
            }

            //trimming the last space and commas
            this.displayCategories = this.displayCategories.substring(0, this.displayCategories.length - 2);
        }
        if (this.newsfeed.userThemeStockAllocation != null) {
            var exposureArray = ['Strongly Positive', 'Weakly Positive', 'Neutral', 'Weakly Negative', 'Strongly Negative'];
            this.displayExposure = this.newsfeed.userThemeStockAllocation.exposure != null ? exposureArray[this.newsfeed.userThemeStockAllocation.exposure] : '';
        }

    }
}