import { BotDifficulty } from '@app/services/bot.service';
import { EASY_BOT_NAMES, HARD_BOT_NAMES } from 'common/constants';
import { Service } from 'typedi';

@Service()
export class BotNameService {
    private readonly easyBotInitialName = EASY_BOT_NAMES;
    private readonly hardBotInitialName = HARD_BOT_NAMES;
    private addedEasyNames: string[];
    private addedHardNames: string[];
    constructor() {
        this.addedEasyNames = [];
        this.addedHardNames = [];
    }

    getBotName(difficulty: BotDifficulty, playerName: string): string {
        let possibleNames: string[];
        if (difficulty === BotDifficulty.Easy) {
            possibleNames = [...this.easyBotInitialName, ...this.addedEasyNames];
        } else {
            possibleNames = [...this.hardBotInitialName, ...this.addedHardNames];
        }
        let botName;
        while ((botName = possibleNames[Math.floor(Math.random() * possibleNames.length)]) === playerName);
        return botName;
    }

    addBotName(difficulty: BotDifficulty, name: string): void {
        switch (difficulty) {
            case BotDifficulty.Easy:
                this.addedEasyNames.push(name);
                break;
            case BotDifficulty.Hard:
                this.addedHardNames.push(name);
                break;
        }
    }

    removeBotName(difficulty: BotDifficulty, name: string): void {
        let index: number;
        switch (difficulty) {
            case BotDifficulty.Easy:
                index = this.addedEasyNames.indexOf(name);
                if (index < 0) return;
                this.addedEasyNames.splice(index, 1);
                break;
            case BotDifficulty.Hard:
                index = this.addedHardNames.indexOf(name);
                if (index < 0) return;
                this.addedHardNames.splice(index, 1);
                break;
        }
    }
}
