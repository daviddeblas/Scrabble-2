import configsJson from '@app/../assets/game-config.json';
import { GameConfigs } from '@app/classes/game-configs';
import Container, { Service } from 'typedi';
import { GameConfig } from '@app/classes/game-config';
import { DictionaryService } from './dictionary.service';

@Service()
export class GameConfigService {
    configs: GameConfigs;

    constructor() {
        this.configs = Object.assign(new GameConfigs(), configsJson);
        this.configs.configs.forEach((config) => {
            config.dictionary = Container.get(DictionaryService);
        });
    }

    getConfigFromName(name: string): GameConfig {
        const config = this.configs.configs.find((c) => c.name === name);
        if (config === undefined) throw new Error('config not found');
        return config;
    }
}
