import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Game } from '@app/classes/game/game';
import { copyLetterConfigItem, LetterConfigItem } from '@app/classes/letter-config-item';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Room } from '@app/classes/room';
import { Solver } from '@app/classes/solver';
import { stringToLetter, stringToLetters } from 'common/classes/letter';
import { Vec2 } from 'common/classes/vec2';
import { DECIMAL_BASE, POSITION_LAST_CHAR } from 'common/constants';
import io from 'socket.io';
import { Service } from 'typedi';
import { DictionaryService } from './dictionary.service';

@Service()
export class CommandService {
    constructor(public dictionaryService: DictionaryService) {}
    async onCommand(game: Game, sockets: io.Socket[], command: string, playerNumber: number): Promise<void> {
        const error = await this.processCommand(game, sockets, command, playerNumber);
        if (error !== undefined) this.errorOnCommand(game, sockets, error, playerNumber);
        if (game.needsToEnd()) this.endGame(game, sockets);
    }

    actionAfterTimeout(room: Room) {
        return () => {
            const game = room.game as Game;
            room.commandService.processSkip(game, room.sockets, [], game.activePlayer as number);
            room.commandService.postCommand(game, room.sockets);
            if (game.needsToEnd()) {
                room.commandService.endGame(game, room.sockets);
            }
            return undefined;
        };
    }

    private async processCommand(game: Game, sockets: io.Socket[], fullCommand: string, playerNumber: number): Promise<GameError | undefined> {
        if (game.gameFinished) return new GameError(GameErrorType.GameIsFinished);
        const [command, ...args] = fullCommand.split(' ');
        let error: GameError | undefined;
        switch (command) {
            case 'placer':
                error = this.processPlace(game, sockets, args, playerNumber);
                break;
            case 'échanger':
                error = this.processDraw(game, sockets, args, playerNumber);
                break;
            case 'passer':
                error = this.processSkip(game, sockets, args, playerNumber);
                break;
            case 'réserve':
                this.processBag(game, sockets, args, playerNumber);
                break;
            case 'indice':
                error = await this.processHint(game, sockets, args, playerNumber);
                break;
        }
        return error;
    }

    private processBag(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): void {
        const lettersToSend = [...game.bag.letters];
        lettersToSend.push(...game.players[(playerNumber + 1) % game.players.length].easel);
        const originalConfig = game.config.letters.map((item) => copyLetterConfigItem(item));

        originalConfig.forEach((configItem) => {
            configItem.amount = 0;
        });
        lettersToSend.forEach((letter) => {
            (originalConfig.find((configItem) => configItem.letter === letter) as LetterConfigItem).amount++;
        });

        const message = 'Réserve: \n'.concat(...originalConfig.map((configItem) => `${configItem.letter}: ${configItem.amount},\n`));

        sockets[playerNumber].emit('receive message', { username: '', message, messageType: 'System' });
    }

    private processPlace(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): GameError | undefined {
        if (!this.validatePlace(game.config, args)) return new GameError(GameErrorType.WrongPlaceArgument);
        const pointBeforePlacement = game.players[playerNumber].score;
        const argsForParsePlaceCall = this.parsePlaceCall(game, args);
        const error = game.place(argsForParsePlaceCall[0], argsForParsePlaceCall[1], playerNumber);
        if (error) return error;
        const pointsWon = game.players[playerNumber].score - pointBeforePlacement;
        args.push('- ' + pointsWon + ' points');
        sockets.forEach((s) => {
            s.emit('place success', { args, username: game.players[playerNumber].name });
        });
        this.postCommand(game, sockets);
        return;
    }

    private processDraw(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): GameError | undefined {
        if (!(/^[a-z/*]*$/.test(args[0]) && args.length === 1)) return new GameError(GameErrorType.WrongDrawArgument);
        game.draw(stringToLetters(args[0]), playerNumber);
        const lettersToSendEveryone: string[] = [];
        // Même si on remplace le eslint par la structure for-of, il y a quand même un eslint car on utilise
        // jamais directement l'index, donc on a décidé de juste ignorer le problème de la structure du for
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < args[0].length; i++) lettersToSendEveryone.push('#');

        sockets.forEach((s, index) => {
            if (index === playerNumber) s.emit('draw success', { letters: args[0], username: game.players[playerNumber].name });
            else s.emit('draw success', { letters: lettersToSendEveryone, username: game.players[playerNumber].name });
        });
        this.postCommand(game, sockets);
        return;
    }

    private processSkip(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): GameError | undefined {
        if (args.length > 0) return new GameError(GameErrorType.WrongSkipArgument);
        game.skip(playerNumber);
        sockets.forEach((s) => {
            s.emit('skip success', game.players[playerNumber].name);
        });
        this.postCommand(game, sockets);
        return;
    }

    private async processHint(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): Promise<GameError | undefined> {
        if (args.length > 0) return new GameError(GameErrorType.WrongHintArgument);
        const solver = new Solver(game.config.dictionary, game.board, game.players[playerNumber].easel);
        const hints = await solver.getHints();
        sockets[playerNumber].emit('hint success', { hints });
        return;
    }

    private postCommand(game: Game, sockets: io.Socket[]): void {
        game.resetTimer();
        sockets.forEach((s) => {
            s.emit('turn ended');
        });
        game.actionAfterTurn();
    }

    private endGame(game: Game, sockets: io.Socket[]): void {
        sockets.forEach((s, i) => {
            const endGameStatus = game.endGame().toEndGameStatus(i);
            s.emit('end game', endGameStatus);
        });
    }

    private errorOnCommand(game: Game, sockets: io.Socket[], error: Error, playerNumber: number): void {
        const delayForInvalidWord = 3000;
        if (sockets[playerNumber]) sockets[playerNumber].emit('error', (error as Error).message);
        if (error.message !== GameErrorType.InvalidWord) return;
        game.stopTimer();
        setTimeout(() => {
            game.nextTurn();
            this.postCommand(game, sockets);
        }, delayForInvalidWord);
    }

    private validatePlace(gameConfig: GameConfig, args: string[]): boolean {
        let commandIsCorrect = false;
        if (args.length !== 2) return false;

        commandIsCorrect = true;
        commandIsCorrect &&= /^[a-o]*$/.test(args[0][0]);
        commandIsCorrect &&= /^[a-z0-9]*$/.test(args[0]);
        commandIsCorrect &&= /^[a-zA-Z]*$/.test(args[1]);
        const columnNumber = parseInt((args[0].match(/\d+/) as RegExpMatchArray)[0], DECIMAL_BASE); // Prend les nombres d'un string
        const minColumnNumber = 1;
        const maxColumnNumber = gameConfig.boardSize.x;
        commandIsCorrect &&= columnNumber >= minColumnNumber && columnNumber <= maxColumnNumber;
        if (args[1].length > 1) {
            commandIsCorrect &&= /^[vh]$/.test(args[0].slice(POSITION_LAST_CHAR));
        }
        return commandIsCorrect;
    }

    private parsePlaceCall(game: Game, args: string[]): [PlacedLetter[], number[]] {
        const positionNumber = (args[0].match(/\d+/) as RegExpMatchArray)[0];
        const xPositionFromNumber = parseInt(positionNumber, DECIMAL_BASE) - 1;
        const yPositionFromLetter = args[0].charCodeAt(0) - 'a'.charCodeAt(0);

        let iterationVector = new Vec2(xPositionFromNumber, yPositionFromLetter);

        let direction = new Vec2(1, 0);
        if (args[1].length > 1 && args[0].slice(POSITION_LAST_CHAR) === 'v') direction = new Vec2(0, 1);

        const placableLetters: PlacedLetter[] = [];
        const blanks: number[] = [];
        for (let i = 0; i < args[1].length; i++) {
            while (game.board.letterAt(iterationVector)) iterationVector = iterationVector.add(direction);
            placableLetters.push(new PlacedLetter(stringToLetter(args[1].charAt(i).toLowerCase()), iterationVector.copy()));
            if (/^[A-Z]*$/.test(args[1].charAt(i))) blanks.push(i);
            iterationVector = iterationVector.add(direction);
        }
        return [placableLetters, blanks];
    }
}
