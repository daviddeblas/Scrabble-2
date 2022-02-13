import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';

export class PlacedLetter {
    constructor(public letter: Letter, public position: Vec2) {}

    copy(): PlacedLetter {
        return new PlacedLetter(this.letter, this.position.copy());
    }

    equals(b: PlacedLetter): boolean {
        return this.letter === b.letter && this.position.equals(b.position);
    }
}
