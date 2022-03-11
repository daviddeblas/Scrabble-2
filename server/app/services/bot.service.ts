import { Game } from '@app/classes/game/game';
import { BOT_NAMES } from 'common/constants';
import { Service } from 'typedi';

export enum BotDifficulty {
    Easy,
}

@Service()
export class BotService {
    // eslint-disable-next-line no-unused-vars
    move(game: Game, difficulty: BotDifficulty): string {
        return 'passer';
    }

    getName(): string {
        return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    }
}
