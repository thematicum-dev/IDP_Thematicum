import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NavigationModel } from "../../models/navigationModel";

@Component({
  selector: 'app-pagination', 
  templateUrl: 'pagination.component.html'
})
export class PaginationComponent { 
  totalPages: number = 0;
  pages: number[] = [];
  resultsPerPage: number = 10;
  currentPage: number = 1;

  @Input('totalResults')
  totalResults: number = 0;

  @Input('initialPage')
  initialPage: number = 0;

  @Output('navigate')
  navigation: EventEmitter<NavigationModel> = new EventEmitter<NavigationModel>();

  ngOnChanges(changes: SimpleChanges) {
    if(changes.totalResults && !changes.totalResults.firstChange){ 
      this.setTotalPages(changes.totalResults.currentValue);
    }
    if(changes.initialPage && changes.initialPage.previousValue != changes.initialPage.currentValue){      
      this.currentPage = this.initialPage;
    }
  }

  setTotalPages(totalResults: number){
      this.totalPages = Math.ceil(totalResults / this.resultsPerPage);
      this.pages = Array(this.totalPages).fill(0); // dummy array for ngFor
  }

  directPageNavigation(page){
    this.currentPage = page;
    this.navigation.emit(new NavigationModel(this.currentPage, this.resultsPerPage));
  }
  
  nextPage() {
    if(this.currentPage + 1 > this.pages.length) return;
    this.currentPage++;
    this.navigation.emit(new NavigationModel(this.currentPage, this.resultsPerPage));
  }

  previousPage() {
    if(this.currentPage - 1 < 1) return;
    this.currentPage--;
    this.navigation.emit(new NavigationModel(this.currentPage, this.resultsPerPage));
  }

  setCurrentPage(page: number){
    this.currentPage = page;
  }

  nextResultStartsFrom(){
    return ((this.currentPage - 1) * this.resultsPerPage) + 1;
  }
}