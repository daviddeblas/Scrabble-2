import { Component, Input } from '@angular/core';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-word-x3]',
    templateUrl: './cell-word-x3.component.html',
    styleUrls: ['./cell-word-x3.component.scss'],
})
export class CellWordX3Component {
    @Input() posX: number = 0;
    @Input() posY: number = 0;
}
