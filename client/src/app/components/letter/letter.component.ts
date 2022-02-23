import { Component, Input } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Letter } from 'common/classes/letter';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-letter]',
    templateUrl: './letter.component.html',
    styleUrls: ['./letter.component.scss'],
})
export class LetterComponent {
    @Input() pos: Vec2 = { x: 0, y: 0 };
    @Input() letter: Letter = 'A';
    @Input() value: number | undefined;
    @Input() blank: boolean = false;
    @Input() color: string = '#fffcec';
}
