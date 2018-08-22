import {Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from "../services/theme.service";
import {Location} from '@angular/common';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';



@Component({
    selector: 'app-theme-news',
    templateUrl: 'theme-news.component.html',
    styles: [
        `
        .chart {height: 50%; background: white; overflow:scroll;}

        h1,h2,h4,h5,h6 {
          font-family: 'Roboto', sans-serif;
        }

        p {
          font-family: 'Open Sans', sans-serif;
        }

        .sourceLabel {
          text-align: center;
          background-color: white;
          color: white;
          padding: 25px;
          margin: 10px 0 0 0;
        }

        .flexCont {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: space-around;
          background-color: white;
          padding: 25px 0;
          }

        .article {
          display: flex;
          flex-direction: column;
          width: 19vw;
          margin: 0 0 10px 0;
          // flex-grow: 1;
          }

        .imageCover {
          width: 100%;
        }

        #infotainer {
           background: #8AB0AB;
           color: #1A1D1A;
           text-decoration: none;
        }

        .itemName {
          font-size: 1.25rem;
          margin: 0;
          padding: 10px 15px 10px 15px;
          }

        .itemAuthorName {
          font-size: .85rem;
          margin: 0;
          padding: 0 15px 0 15px;
        }

        .itemDesc {
          color: #1A1D1A;
          font-size: .75em;
          margin: 0;
          padding: 10px 15px 10px 15px;
        }

        @media only screen 
          and (min-device-width: 320px) 
          and (max-device-width: 736px)  {
            
            .flexCont {
          flex-direction: column;
          align-items: center;
          }
            
            .article {
          width: 90%;
            }

        }
        `]
    

})

export class ThemeNewsComponent implements OnInit {
    name: string;
    modifiedName: any
    selectedThemeId: string; //theme Id retrieved from the url
    @Input() theme: Theme;
    @Input() themeId: string;
    articles: any;
    isReady: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private themeService: ThemeService, private location: Location, private sanitizer: DomSanitizer) { }

    
    
    
    ngOnInit(): void {

        if(!this.route.snapshot.params['id']) {
            return;
        }

        this.isReady = false;

        this.selectedThemeId = this.route.snapshot.params['id'];

        this.name = this.theme.name;

        this.themeService.getAllNews(this.theme).subscribe(
            data => {
                console.log(data);

                this.articles = Array.from(data.articles);

                this.isReady = true;

                //display the results nicely
            },
            error => console.log('Error: ', error));    

    }

    trendURL(data) {

        return this.sanitizer.bypassSecurityTrustResourceUrl(data);
    }


}