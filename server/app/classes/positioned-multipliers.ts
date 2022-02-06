import { Multiplier } from '@app/classes/multiplier';
import { Vec2 } from '@app/classes/vec2';

export class PositionedMultipliers {
    constructor(public multiplier: Multiplier, public positions: Vec2[]) {}
}
