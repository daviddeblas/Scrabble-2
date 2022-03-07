/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Game } from '@app/classes/game/game';
import { PlacedLetter } from '@app/classes/placed-letter';
import { stringToLetter, stringToLetters } from 'common/classes/letter';
import { Vec2 } from 'common/classes/vec2';
import { DECIMAL_BASE } from 'common/constants';
import io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class CommandService {
    processCommand(game: Game, sockets: io.Socket[], fullCommand: string, playerNumber: number): void {
        if (game.gameFinished) throw new GameError(GameErrorType.GameIsFinished);
        const [command, ...args] = fullCommand.split(' ');
        switch (command) {
            case 'placer':
                this.processPlace(game, sockets, args, playerNumber);
                break;
            case 'échanger':
                this.processDraw(game, sockets, args, playerNumber);
                break;
            case 'passer':
                this.processSkip(game, sockets, args, playerNumber);
                break;
        }
    }

    onCommand(game: Game, sockets: io.Socket[], command: string, playerNumber: number) {
        try {
            this.processCommand(game, sockets, command, playerNumber);
            this.postCommand(game, sockets);
        } catch (error) {
            this.errorOnCommand(game, sockets, error, playerNumber);
        }
        if (game.needsToEnd()) {
            this.endGame(game, sockets);
        }
    }

    processPlace(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): void {
        if (!this.validatePlace(game.config, args)) throw new GameError(GameErrorType.WrongPlaceArgument);
        const argsForParsePlaceCall = this.parsePlaceCall(game, args);
        game.place(argsForParsePlaceCall[0], argsForParsePlaceCall[1], playerNumber);
        sockets.forEach((s) => {
            s.emit('place success', { args, username: game.players[playerNumber].name });
        });
    }

    processDraw(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): void {
        if (!(/^[a-z/*]*$/.test(args[0]) && args.length === 1)) throw new GameError(GameErrorType.WrongDrawArgument);
        game.draw(stringToLetters(args[0]), playerNumber);
        const lettersToSendEveryone: string[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < args[0].length; i++) lettersToSendEveryone.push('#');

        sockets.forEach((s, index) => {
            if (index === playerNumber) s.emit('draw success', { letters: args[0], username: game.players[playerNumber].name });
            else s.emit('draw success', { letters: lettersToSendEveryone, username: game.players[playerNumber].name });
        });
    }

    processSkip(game: Game, sockets: io.Socket[], args: string[], playerNumber: number): void {
        if (args.length > 0) throw new GameError(GameErrorType.WrongSkipArgument);
        game.skip(playerNumber);
        sockets.forEach((s) => {
            s.emit('skip success', game.players[playerNumber].name);
        });
    }

    postCommand(game: Game, sockets: io.Socket[]): void {
        game.resetTimer();
        sockets.forEach((s) => {
            s.emit('turn ended');
        });
    }

    endGame(game: Game, sockets: io.Socket[]): void {
        sockets.forEach((s, i) => {
            const endGameStatus = game.endGame().toEndGameStatus(i);
            s.emit('end game', endGameStatus);
        });
    }

    private errorOnCommand(game: Game, sockets: io.Socket[], error: Error, playerNumber: number): void {
        const delayForInvalidWord = 3000;
        sockets[playerNumber].emit('error', (error as Error).message);
        if (error.message === GameErrorType.InvalidWord) {
            game.stopTimer();
            setTimeout(() => {
                game.nextTurn();
                this.postCommand(game, sockets);
            }, delayForInvalidWord);
        }
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
            commandIsCorrect &&= /^[vh]$/.test(args[0].slice(-1));
        }
        return commandIsCorrect;
    }

    private parsePlaceCall(game: Game, args: string[]): [PlacedLetter[], number[]] {
        const positionNumber = (args[0].match(/\d+/) as RegExpMatchArray)[0];
        const xPositionFromNumber = parseInt(positionNumber, DECIMAL_BASE) - 1;
        const yPositionFromLetter = args[0].charCodeAt(0) - 'a'.charCodeAt(0);

        let iterationVector = new Vec2(xPositionFromNumber, yPositionFromLetter);

        let direction = new Vec2(1, 0);
        if (args[1].length > 1 && args[0].slice(-1) === 'v') direction = new Vec2(0, 1);

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
