import { Player } from '@app/classes/game/player';

export class GameFinishStatus {
    constructor(public players: Player[], public winner: string | null) {}
}
