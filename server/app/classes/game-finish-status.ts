import { Player } from '@app/classes/game/player';

export interface EndGameStatus {
    players: { player: Player; opponent: Player };
    winner: string | null;
}
export class GameFinishStatus {
    constructor(public players: Player[], public winner: string | null) {}

    toEndGameStatus(playerIndex: number): EndGameStatus {
        return { players: { player: this.players[playerIndex], opponent: this.players[(playerIndex + 1) % 2] }, winner: this.winner };
    }
}
