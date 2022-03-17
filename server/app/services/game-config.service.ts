import { Dictionary } from '@app/classes/dictionary';
import { GameConfig } from '@app/classes/game-config';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { Service } from 'typedi';
import { DictionaryService } from './dictionary.service';

const configsPath = 'assets/game-configs';

@Service()
export class GameConfigService {
    configs: GameConfig[];

    constructor(dictionaryService: DictionaryService) {
        readdir(configsPath)
            .then((paths) => {
                return paths.forEach(async (fileName) => {
                    return readFile(path.join(configsPath, fileName), { encoding: 'utf8' }).then((json) => {
                        this.configs.push(JSON.parse(json));
                    });
                });
            })
            .then(() => {
                this.configs.forEach((c) => {
                    c.dictionary = dictionaryService.getDictionary('Mon Dictionnaire') as Dictionary;
                });
            });
    }

    getConfigFromName(name: string): GameConfig {
        const config = this.configs.find((c) => c.name === name);
        if (config === undefined) throw new Error('config not found');
        return config;
    }
}
