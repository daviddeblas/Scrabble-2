import { Vec2 } from 'common/classes/vec2';

export enum Direction {
    HORIZONTAL = 'h',
    VERTICAL = 'v',
}

export class Word {
    constructor(public letters: string, public position: Vec2, public direction?: Direction) {}

    length(): number {
        return this.letters.length;
    }
}
