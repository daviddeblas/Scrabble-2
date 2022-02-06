import configsJson from '@app/../assets/game-config.json';
import { GameConfigs } from '@app/classes/game-configs';
import { Service } from 'typedi';
import { GameConfig } from '@app/classes/game-config';

@Service()
export class GameConfigService {
    configs: GameConfigs = Object.assign(new GameConfigs(), configsJson);

    getConfigFromName(name: string): GameConfig {
        const config = this.configs.configs.find((c) => c.name === name);
        if (config === undefined) throw new Error('config not found');
        return config;
    }
}
