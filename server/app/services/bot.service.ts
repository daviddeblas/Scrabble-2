import { Game } from '@app/classes/game/game';
import { Solver } from '@app/classes/solver';
import { Letter, lettersToString } from 'common/classes/letter';
import { BOT_NAMES } from 'common/constants';
import { Container, Service } from 'typedi';
import { DictionaryService } from './dictionary.service';

export enum BotDifficulty {
    Easy = 'Débutant',
    Hard = 'Expert',
}

export enum CategoryOfPoints {
    MinLowCategory = 0,
    MaxLowCategory = 6,
    MinMidCategory = 7,
    MaxMidCategory = 12,
    MinHighCategory = 13,
    MaxHighCategory = 18,
}

@Service()
export class BotService {
    readonly passCommandName = 'passer';
    readonly exchangeCommandName = 'échanger';
    readonly placeCommandName = 'placer';

    move(game: Game, difficulty: BotDifficulty): string {
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
            return this.placeCommand(game, BotDifficulty.Easy);
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

    private placeCommand(game: Game, difficulty: BotDifficulty): string {
        const solver = new Solver(Container.get(DictionaryService).dictionary, game.board.board, game.players[1].easel);
        const foundPlacements: Map<string[], number> = solver.getEasyBotSolutions(game.board);
        if (foundPlacements.size === 0) return 'passer';
        return this.placeCommandName + ' ' + this.determineWord(foundPlacements, difficulty);
    }

    private determineWord(placements: Map<string[], number>, difficulty: BotDifficulty): string {
        if (difficulty === BotDifficulty.Hard) return 'passer';
        const fortyPercent = 0.4;
        const thirtyPercent = 0.3;
        let lowestPoints: number;
        let maxPoints: number;
        const wordPossibilities: string[][] = [];
        let chooseRandomPoints: number;
        let indexChosen: number;
        while (wordPossibilities.length === 0) {
            chooseRandomPoints = Math.random();
            indexChosen = chooseRandomPoints < fortyPercent ? 0 : chooseRandomPoints < fortyPercent + thirtyPercent ? 1 : 2;
            switch (indexChosen) {
                case 0:
                    lowestPoints = CategoryOfPoints.MinLowCategory;
                    maxPoints = CategoryOfPoints.MaxLowCategory;
                    break;
                case 1:
                    lowestPoints = CategoryOfPoints.MinMidCategory;
                    maxPoints = CategoryOfPoints.MaxMidCategory;
                    break;
                case 2:
                    lowestPoints = CategoryOfPoints.MinHighCategory;
                    maxPoints = CategoryOfPoints.MaxHighCategory;
                    break;
            }
            placements.forEach((value, key) => {
                if (lowestPoints < value && value < maxPoints) wordPossibilities.push(key);
            });
        }
        return wordPossibilities[Math.floor(Math.random() * wordPossibilities.length)].join(' ');
    }
}
