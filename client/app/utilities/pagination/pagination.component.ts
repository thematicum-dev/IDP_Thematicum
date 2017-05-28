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
  currentPage: number = 0;

  @Input('totalResults')
  totalResults: number = 0;

  @Output('navigate')
  navigation: EventEmitter<NavigationModel> = new EventEmitter<NavigationModel>();

  ngOnChanges(changes: SimpleChanges) {
    if(!changes.totalResults.firstChange){      
      this.currentPage = 1;
      this.setTotalPages(changes.totalResults.currentValue);
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
    this.currentPage++;
    this.navigation.emit(new NavigationModel(this.currentPage, this.resultsPerPage));
  }

  previousPage() {
    this.currentPage--;
    this.navigation.emit(new NavigationModel(this.currentPage, this.resultsPerPage));
  }
}