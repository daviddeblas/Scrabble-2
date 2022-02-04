import { Player } from './player';

export class GameFinishStatus {
    constructor(public players: Player[], public winner: string | null) {}
}
