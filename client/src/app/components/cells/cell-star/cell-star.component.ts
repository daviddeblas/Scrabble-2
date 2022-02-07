import { Component, Input } from '@angular/core';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-star]',
    templateUrl: './cell-star.component.html',
    styleUrls: ['./cell-star.component.scss'],
})
export class CellStarComponent {
    @Input() posX: number = 0;
    @Input() posY: number = 0;
}
