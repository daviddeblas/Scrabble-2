import { Component, Input } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-word-x2]',
    templateUrl: './cell-word-x2.component.html',
    styleUrls: ['./cell-word-x2.component.scss'],
})
export class CellWordX2Component {
    @Input() pos: Vec2 = { x: 0, y: 0 };
}
