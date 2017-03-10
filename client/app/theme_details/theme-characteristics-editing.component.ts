import {Component, EventEmitter, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {Theme} from "../models/theme";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-theme-characteristics-editing',
    templateUrl: 'theme-characteristics-editing.component.html'
})
export class ThemeCharacteristicsEditing implements OnChanges {
    @Input() theme: Theme;
    @Input() themeTags: string[];
    @Output() themeEmitter: EventEmitter<Theme> = new EventEmitter<Theme>();
    themeCopy: Theme;
    maxDescriptionLength: number = 500;

    constructor(private themeService: ThemeService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['theme'].currentValue  && changes['themeTags'].currentValue) {
            //make a shallow copy of theme, in case the changes to the model are canceled
            this.themeCopy = Object.assign({}, changes['theme'].currentValue);
            const themeTagsCopy = Object.assign([], changes['themeTags'].currentValue);
            this.themeCopy.tags = themeTagsCopy;
        }
    }

    onSubmit() {
        //call service method to update theme and emit updated theme
        this.themeService.updateTheme(this.theme).subscribe(
            (data: Theme) => this.themeEmitter.emit(data),
            error => console.log(error));
    }

    notifyCancelEditing() {
        //theme properties are no longer editable
        this.themeEmitter.emit(this.themeCopy);
    }

    getDescriptionCharactersRemaining(): string {
        const descriptionLength = this.theme.description ? this.theme.description.length : 0;
        return `${this.maxDescriptionLength - descriptionLength} characters remaining`;
    }
}