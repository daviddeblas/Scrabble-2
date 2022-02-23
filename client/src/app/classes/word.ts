import { Letter } from 'common/classes/letter';
import { Vec2 } from './vec2';

export enum Direction {
    HORIZONTAL = 'h',
    VERTICAL = 'v',
}

export class Word {
    constructor(public letters: Letter[], public position: Vec2, public direction?: Direction) {}

    length(): number {
        return this.letters.length;
    }
}
