import { Letter } from 'common/classes/letter';
import { Vec2 } from './vec2';
export interface PlacedLetter {
    letter: Letter;
    position: Vec2;
    blank: boolean;
}
