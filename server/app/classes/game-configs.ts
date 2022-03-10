import { GameConfig } from '@app/classes/game-config';

export enum GameMode {
    None,
    Classical,
    Log2990,
}

export class GameConfigs {
    configs: GameConfig[];
    gameMode: number;
}
