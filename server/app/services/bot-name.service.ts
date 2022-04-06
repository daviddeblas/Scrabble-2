import { BotDifficulty } from '@app/services/bot.service';
import { EASY_BOT_NAMES, HARD_BOT_NAMES } from 'common/constants';
import io from 'socket.io';
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

    setUpBotNameSocket(socket: io.Socket): void {
        socket.on('get bot names', () => {
            this.sendAllBotNames(socket);
        });
        socket.on('add bot name', (difficulty: BotDifficulty, name: string) => {
            this.addBotName(difficulty, name);
            this.sendAllBotNames(socket);
        });
        socket.on('delete bot name', (difficulty: BotDifficulty, name: string) => {
            this.removeBotName(difficulty, name);
            this.sendAllBotNames(socket);
        });
        socket.on('modify bot name', (previousName: string, modifiedName: string) => {
            this.modifyBotName(previousName, modifiedName);
            this.sendAllBotNames(socket);
        });
        socket.on('reset all names', () => {
            this.resetAllNames();
            this.sendAllBotNames(socket);
        });
    }

    private addBotName(difficulty: BotDifficulty, name: string): void {
        if (this.botNameExists(name)) return;
        switch (difficulty) {
            case BotDifficulty.Easy:
                this.addedEasyNames.push(name);
                break;
            case BotDifficulty.Hard:
                this.addedHardNames.push(name);
                break;
        }
    }

    private removeBotName(difficulty: BotDifficulty, name: string): void {
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

    private resetAllNames(): void {
        this.addedEasyNames = [];
        this.addedHardNames = [];
    }

    private botNameExists(name: string): boolean {
        let exists = false;
        exists ||= [...this.easyBotInitialName, ...this.addedEasyNames].includes(name);
        exists ||= [...this.hardBotInitialName, ...this.addedHardNames].includes(name);
        return exists;
    }

    private modifyBotName(previousName: string, modifiedName: string): void {
        let nameIndex: number;
        if ((nameIndex = this.addedEasyNames.indexOf(previousName)) >= 0) {
            this.addedEasyNames[nameIndex] = modifiedName;
        } else if ((nameIndex = this.addedHardNames.indexOf(previousName)) >= 0) {
            this.addedHardNames[nameIndex] = modifiedName;
        }
    }

    private sendAllBotNames(socket: io.Socket): void {
        const easyBotName = [...this.easyBotInitialName, ...this.addedEasyNames];
        const hardBotNames = [...this.hardBotInitialName, ...this.addedHardNames];
        socket.emit('receive bot name', { easyBotName, hardBotNames });
    }
}
