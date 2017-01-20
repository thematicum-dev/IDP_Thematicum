import {Component} from '@angular/core';
@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: [
        `.modal {
            background: rgba(0,0,0,0.6);
        }`]
})
export class ModalComponent {
    public visible = false;
    private visibleAnimate = false;

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }
}