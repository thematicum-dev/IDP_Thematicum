
import {Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from "../services/theme.service";
import {Location,DatePipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

declare var trends: any;

@Component({
    selector: 'app-theme-feed',
    templateUrl: 'theme-feed.component.html',
    
    providers:[DatePipe]
    

})

export class ThemeFeedComponent implements OnInit {
    name: string;
    modifiedName: any;
    @Input() themeId: string;
    @Input() theme: Theme;
    data: any;

    lineChartData: any = [{ 
            data: []
        }];

    lineChartLabels: any = [];

    lineChartColors: any = [];

    constructor(private route: ActivatedRoute, private router: Router, private themeService: ThemeService, private location: Location, private sanitizer: DomSanitizer, private datePipe: DatePipe) { 
        
    }
    
    ngOnInit(): void {

        this.name = this.theme.name


        this.themeService.getAllTrends(this.theme).subscribe(
            result => {
                console.log(result);

                this.data = result;


                this.lineChartData = [];
                for(var i=0; i<result.value.length; i++) {
                    this.lineChartData.push({data: result.value[i].value, label: result.value[i].trendName});
                    var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
                    this.lineChartColors.push({borderColor: hue, pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff'})
                }
                

                this.lineChartLabels = result.timeline;                      

                //display the results nicely
            },
            error => console.log('Error: ', error));
        
            
    }

    
    // lineChart
  
  public lineChartOptions:any = {
    responsive: true
  };


  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
 
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }   



}