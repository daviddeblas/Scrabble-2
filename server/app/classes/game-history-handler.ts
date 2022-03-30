import { Player } from '@app/classes/game/player';
import { GameHistory } from 'common/interfaces/game-history';
import { MILLISECONDS_PER_SEC } from './game/game';

export class GameHistoryHandler {
    private startDate: Date;
    constructor() {
        this.startDate = new Date();
    }

    createGameHistoryData(players: Player[], isSurrender: boolean /* gameMode:GameMode */) {
        const gameDuration = (Date.now() - this.startDate.getTime()) / MILLISECONDS_PER_SEC;
        const history: GameHistory = {
            date: this.startDate.toLocaleString(),
            gameDuration,
            namePlayer1: players[0].name,
            scorePlayer1: players[0].score,
            namePlayer2: players[1].name,
            scorePlayer2: players[1].score,
            gameMode: 'classical',
            isSurrender,
        };
        return history;
    }
}
