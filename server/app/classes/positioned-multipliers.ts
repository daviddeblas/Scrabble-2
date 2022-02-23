import { Vec2 } from '@app/classes/vec2';
import { Multiplier } from 'common/classes/multiplier';

export class PositionedMultipliers {
    constructor(public multiplier: Multiplier, public positions: Vec2[]) {}
}
