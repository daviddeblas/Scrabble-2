import { LetterConfig } from '@app/classes/letter-config';
import configsJson from '@app/../assets/letter-config.json';
import { LetterConfigs } from '@app/classes/letter-configs';
import { Service } from 'typedi';

@Service()
export class LetterConfigService {
    configs: LetterConfigs = Object.assign(new LetterConfigs(), configsJson);

    getConfigFromName(name: string): LetterConfig {
        const config = this.configs.configs.find((c) => c.name === name);
        if (config === undefined) throw new Error('config not found');
        return config;
    }
}
