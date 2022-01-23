import { Letter } from './letter';
import { Vec2 } from './vec2';

enum Direction {
    HORIZONTAL = 'h',
    VERTICAL = 'v',
}

export class Word {
    letters: Letter[];
    position: Vec2;
    direction?: Direction;
}
