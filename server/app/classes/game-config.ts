import { LetterConfigItem } from '@app/classes/letter-config-item';
import { PositionedMultipliers } from './positioned-multipliers';
import { Vec2 } from './vec2';

export class GameConfig {
    constructor(
        public name: string = 'default',
        public letters: LetterConfigItem[] = [],
        public boardSize: Vec2 = new Vec2(0, 0),
        public multipliers: PositionedMultipliers[] = [],
    ) {}
}
