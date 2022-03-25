import { GameMode } from 'common/interfaces/game-mode';
import { DEFAULT_TIMER } from '../constants';

export class GameOptions {
    public gameMode: GameMode;
    constructor(public hostname: string, public dictionaryType: string, public timePerRound: number = DEFAULT_TIMER) {
        this.gameMode = GameMode.Classical;
    }
    changeGameMode(gameMode: GameMode): void {
        this.gameMode = gameMode;
    }
}
