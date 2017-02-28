import {Component, EventEmitter, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {Theme} from "../models/theme";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {FormBuilder, Validators} from "@angular/forms";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-theme-characteristics-editing',
    templateUrl: 'theme-characteristics-editing.component.html'
})
export class ThemeCharacteristicsEditingComponent implements OnChanges {
    @Input() theme: Theme;
    @Input() themeTags: any[];
    @Output() themeEmitter: EventEmitter<Theme> = new EventEmitter<Theme>();
    themeCopy: Theme;

    constructor(private themeService: ThemeService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['theme'].currentValue && changes['themeTags'].currentValue) {
            //make a shallow copy of theme, in case the changes to the model need to be canceled
            this.themeCopy = Object.assign({}, changes['theme'].currentValue)
            let themeTagsCopy = Object.assign([], changes['themeTags'].currentValue);
            this.themeCopy.tags = themeTagsCopy;
        }
    }

    onSubmit() {
        this.themeService.updateTheme(this.theme).subscribe(
            (data: Theme) => {
                console.log(data);
                this.themeEmitter.emit(data)
            },
            error => console.log(error)
        )
    }

    notifyCancelEditing() {
        //theme characteristics are no longer editable
        this.themeEmitter.emit(this.themeCopy);
    }
}
