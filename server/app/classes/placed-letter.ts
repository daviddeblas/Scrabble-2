import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';

export class PlacedLetter {
    constructor(public letter: Letter, public position: Vec2) {};
}
