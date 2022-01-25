import { LetterConfigItem } from '@app/classes/letter-config-item';
import { PositionedMultipliers } from './positioned-multipliers';
import { Vec2 } from './vec2';

export class GameConfig {
    name: string;
    letters: LetterConfigItem[];
    boardSize: Vec2;
    multipliers: PositionedMultipliers[];
}
