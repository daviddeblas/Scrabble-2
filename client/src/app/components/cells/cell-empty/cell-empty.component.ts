import { Component, Input } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-empty]',
    templateUrl: './cell-empty.component.html',
    styleUrls: ['./cell-empty.component.scss'],
})
export class CellEmptyComponent {
    @Input() pos: Vec2 = { x: 0, y: 0 };

    click(): void {}
}
