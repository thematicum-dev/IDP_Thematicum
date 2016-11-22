import { Component } from '@angular/core';

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html'
})
export class ThemeCreationComponent {
    selectedTags: string[] = ['Albania', 'Germany'];
}