import { Component } from '@angular/core';

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html'
})
export class ThemeCreationComponent {
    selectedTags: string[] = ['Tag 1', 'Tag 2'];
    testValue = "test value directive";
}