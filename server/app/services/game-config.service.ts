import { Dictionary } from '@app/classes/dictionary';
import { GameConfig } from '@app/classes/game-config';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { Service } from 'typedi';
import { DictionaryService } from './dictionary.service';

const configsPath = 'assets/game-configs';

@Service()
export class GameConfigService {
    configs: GameConfig[];

    constructor(private dictionaryService: DictionaryService) {
        this.configs = [];
    }

    async init() {
        this.configs = [];
        const paths = await readdirSync(configsPath);
        paths.forEach(async (fileName, index) => {
            const json = await readFileSync(path.join(configsPath, fileName), { encoding: 'utf8' });
            const config = JSON.parse(json);
            this.configs.push(config);
            this.configs[index].dictionary = this.dictionaryService.getDictionary(config.dictionaryName) as Dictionary;
        });
    }

    getConfigFromName(name: string): GameConfig | Error {
        const config = this.configs.find((c) => c.name === name);
        if (config === undefined) return new Error('config not found');
        return config;
    }
}
