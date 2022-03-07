import { LetterConfigItem } from '@app/classes/letter-config-item';
import { DictionaryService } from '@app/services/dictionary.service';
import { Vec2 } from 'common/classes/vec2';
import Container from 'typedi';
import { PositionedMultipliers } from './positioned-multipliers';

export class GameConfig {
    constructor(
        public name: string = 'default',
        public letters: LetterConfigItem[] = [],
        public boardSize: Vec2 = new Vec2(0, 0),
        public multipliers: PositionedMultipliers[] = [],
        public dictionary: DictionaryService = Container.get(DictionaryService),
    ) {}
}
