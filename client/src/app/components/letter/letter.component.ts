import { Component, Input } from '@angular/core';
import { Letter } from 'common/classes/letter';
import { iVec2 } from 'common/classes/vec2';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-letter]',
    templateUrl: './letter.component.html',
    styleUrls: ['./letter.component.scss'],
})
export class LetterComponent {
    @Input() pos: iVec2 = { x: 0, y: 0 };
    @Input() letter: Letter = 'A';
    @Input() value: number | undefined;
    @Input() blank: boolean = false;
    @Input() color?: string = '#fffcec';
}
