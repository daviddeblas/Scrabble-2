import { Game } from '@app/classes/game/game';
import { Letter, lettersToString } from 'common/classes/letter';
import { BOT_NAMES, MAX_BOT_PLACEMENT_TIME } from 'common/constants';
import { Service } from 'typedi';

export enum BotDifficulty {
    Easy = 'Débutant',
    Hard = 'Expert',
}

@Service()
export class BotService {
    readonly passCommandName = 'passer';
    readonly exchangeCommandName = 'échanger';
    readonly placeCommandName = 'placer';

    // eslint-disable-next-line no-unused-vars
    move(game: Game, difficulty: BotDifficulty): string {
        setTimeout(() => {
            return this.passCommandName;
        }, MAX_BOT_PLACEMENT_TIME);

        let decidedMove = this.passCommandName;
        if (difficulty === BotDifficulty.Easy) {
            decidedMove = this.easyBotMove(game);
        }
        return decidedMove;
    }

    getName(): string {
        return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    }

    private easyBotMove(game: Game): string {
        const percentChance = 0.1;
        const randomMoveChance = Math.random();
        if (0 < randomMoveChance && randomMoveChance < percentChance) {
            return this.passCommandName;
        } else if (percentChance < randomMoveChance && randomMoveChance < percentChance * 2) {
            return this.exchangeCommand(game);
        } else {
            return this.exchangeCommand(game);
            // return this.placeCommand(game, BotDifficulty.Easy);
        }
    }

    private exchangeCommand(game: Game): string {
        const playerEasel = JSON.parse(JSON.stringify(game.players[1].easel));
        const amountLettersToExchange = Math.floor(Math.random() * playerEasel.length + 1);
        if (amountLettersToExchange > game.bag.letters.length) return this.passCommandName;
        const lettersToExchange: Letter[] = [];
        let indexLetterToRemove: number;
        while (lettersToExchange.length < amountLettersToExchange) {
            indexLetterToRemove = Math.floor(Math.random() * playerEasel.length);
            lettersToExchange.push(playerEasel[indexLetterToRemove]);
            playerEasel.splice(indexLetterToRemove, 1);
        }
        const exchangeCommandLetters = lettersToString(lettersToExchange).toLowerCase();
        return this.exchangeCommandName + ' ' + exchangeCommandLetters;
    }
}
