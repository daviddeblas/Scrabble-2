import { Component, Input } from '@angular/core';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-letter-x2]',
    templateUrl: './cell-letter-x2.component.html',
    styleUrls: ['./cell-letter-x2.component.scss'],
})
export class CellLetterX2Component {
    @Input() posX: number = 0;
    @Input() posY: number = 0;
}
