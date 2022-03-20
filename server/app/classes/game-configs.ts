import { GameConfig } from '@app/classes/game-config';

export enum GameMode {
    None = 'none',
    Classical = 'classical',
    Log2990 = 'log2990',
}

export class GameConfigs {
    configs: GameConfig[];
}
