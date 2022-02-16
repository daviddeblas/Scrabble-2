import { GameConfigService } from '@app/services/game-config.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import Container from 'typedi';
import { GameFinishStatus } from './game-finish-status';
import { GameOptions } from './game-options';
import { GameError, GameErrorType } from './game.exception';
import { Game } from './game/game';
import { BLANK_LETTER, stringToLetter, stringToLetters } from './letter';
import { PlacedLetter } from './placed-letter';
import { RoomInfo } from './room-info';
import { Vec2 } from './vec2';

export const MILLISECONDS_PER_SEC = 1000;
export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: Game | null;
    currentTimer: NodeJS.Timeout;

    sockets: io.Socket[];
    constructor(public host: io.Socket, public manager: RoomsManager, public gameOptions: GameOptions) {
        this.clients = new Array(1);
        this.started = false;
        this.host.once('quit', () => this.quitRoomHost());
        this.game = null;
        this.clientName = null;
    }

    join(socket: io.Socket, name: string): void {
        this.host.emit('player joining', name);
        this.clientName = name;
        this.clients[0] = socket;
        const client = socket;
        this.host.once('accept', () => this.inviteAccepted(client));
        this.host.once('refuse', () => this.inviteRefused(client));
        client.once('cancel join room', () => this.quitRoomClient());
    }

    quitRoomHost(): void {
        if (this.clients[0]) this.inviteRefused(this.clients[0]);
        this.manager.removeRoom(this);
        this.manager.notifyAvailableRoomsChange();
    }

    inviteAccepted(client: io.Socket): void {
        client.emit('accepted');
        this.initiateRoomEvents();
    }

    inviteRefused(client: io.Socket): void {
        client.emit('refused');
        this.clients[0] = null;
        this.clientName = null;
    }

    quitRoomClient(): void {
        this.host.emit('player joining cancel');
        this.clients[0] = null;
        this.clientName = null;
    }

    initiateRoomEvents() {
        this.initGame();
        this.initSurrenderGame();
        this.initChatting();
    }

    initGame(): void {
        this.sockets = [this.host, this.clients[0] as io.Socket];

        this.game = new Game(Container.get(GameConfigService).configs.configs[0], [this.gameOptions.hostname, this.clientName as string]);
        this.game.players[0].name = this.gameOptions.hostname;
        this.game.players[1].name = this.clientName as string;

        this.manager.removeSocketFromJoiningList(this.sockets[1]);
        this.manager.notifyAvailableRoomsChange();

        this.sockets.forEach((socket, index) => {
            this.setupSocket(socket, index);
        });
        this.initTimer();
    }

    initSurrenderGame(): void {
        this.sockets.forEach((socket) => {
            socket.on('surrender game', () => {
                this.surrenderGame(socket.id);
            });
        });
    }

    surrenderGame(looserId: string) {
        if (!this.game?.players) throw new GameError(GameErrorType.GameNotExists);
        const gameFinishStatus: GameFinishStatus = new GameFinishStatus(
            this.game.players,
            looserId === this.host.id ? this.clientName : this.gameOptions.hostname,
        );
        this.sockets.forEach((socket) => {
            socket.emit('end game', gameFinishStatus);
        });
    }

    initChatting(): void {
        this.sockets.forEach((s, index) => {
            s.on('send message', ({ username, message }) => {
                this.sockets.forEach((socket, i) => {
                    if (i !== index) socket.emit('receive message', { username, message });
                });
            });
        });
    }

    getRoomInfo(): RoomInfo {
        return new RoomInfo(this.host.id, this.gameOptions);
    }

    removeUnneededListeners(socket: io.Socket): void {
        socket.removeAllListeners('send message').removeAllListeners('surrender game').removeAllListeners('get game status');
    }

    private setupSocket(socket: io.Socket, playerNumber: number): void {
        socket.on('get game status', () => {
            socket.emit('game status', this.gameStatusGetter(playerNumber));
        });
        socket.on('command', (command) => this.onCommand(socket, command, playerNumber));
    }

    private onCommand(socket: io.Socket, command: string, playerNumber: number) {
        try {
            this.processCommand(command, playerNumber);
            this.postCommand();
        } catch (error) {
            this.errorOnCommand(socket, error);
        }
        if (this.game?.needsToEnd()) {
            this.endGame();
        }
    }

    private endGame(): void {
        const game = this.game as Game;
        const info = game.endGame();
        this.sockets.forEach((s) => {
            s.emit('end game', info);
        });
        clearTimeout(this.currentTimer);
    }

    private initTimer(): void {
        this.currentTimer = setTimeout(this.actionAfterTimeout(this), this.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
    }

    private actionAfterTimeout(self: Room): () => void {
        const game = self.game as Game;
        return () => {
            self.processSkip([], game.activePlayer as number);
            self.postCommand();
        };
    }

    private errorOnCommand(socket: io.Socket, error: Error): void {
        const delayForInvalidWord = 3000;
        socket.emit('error', (error as Error).message);
        if (error.message === GameErrorType.InvalidWord) {
            clearTimeout(this.currentTimer);
            setTimeout(() => {
                this.postCommand();
            }, delayForInvalidWord);
        }
    }

    private postCommand(): void {
        clearTimeout(this.currentTimer);
        this.initTimer();
        this.sockets.forEach((s) => {
            s.emit('turn ended');
        });
    }

    private processCommand(fullCommand: string, playerNumber: number): void {
        const game = this.game as Game;
        if (game.gameFinished) throw new GameError(GameErrorType.GameIsFinished);
        const [command, ...args] = fullCommand.split(' ');
        switch (command) {
            case 'placer':
                this.processPlace(args, playerNumber);
                break;
            case 'échanger':
                this.processDraw(args, playerNumber);
                break;
            case 'passer':
                this.processSkip(args, playerNumber);
                break;
        }
    }

    private processPlace(args: string[], playerNumber: number): void {
        if (!this.validatePlace(args)) throw new GameError(GameErrorType.WrongPlaceArgument);
        const argsForParsePlaceCall = this.parsePlaceCall(args);
        const game = this.game as Game;
        game.place(argsForParsePlaceCall[0], argsForParsePlaceCall[1], playerNumber);
        this.sockets.forEach((s) => {
            s.emit('place success', { args, username: game.players[playerNumber].name });
        });
    }

    private processDraw(args: string[], playerNumber: number): void {
        const game = this.game as Game;
        if (!(/^[a-z]*$/.test(args[0]) && args.length === 1)) throw new GameError(GameErrorType.WrongDrawArgument);
        game.draw(stringToLetters(args[0]), playerNumber);
        const lettersToSendEveryone: string[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < args[0].length; i++) lettersToSendEveryone.push('#');

        this.sockets.forEach((s, index) => {
            if (index === playerNumber) s.emit('draw success', { letters: args[0], username: game.players[playerNumber].name });
            else s.emit('draw success', { letters: lettersToSendEveryone, username: game.players[playerNumber].name });
        });
    }

    private processSkip(args: string[], playerNumber: number): void {
        const game = this.game as Game;
        if (args.length > 0) throw new GameError(GameErrorType.WrongSkipArgument);
        game.skip(playerNumber);
        this.sockets.forEach((s) => {
            s.emit('skip success', game.players[playerNumber].name);
        });
    }

    private validatePlace(args: string[]): boolean {
        let commandIsCorrect = false;
        if (args.length !== 2) return false;

        commandIsCorrect = true;
        commandIsCorrect &&= /^[a-o]*$/.test(args[0][0]);
        commandIsCorrect &&= /^[a-z0-9]*$/.test(args[0]);
        commandIsCorrect &&= /^[a-zA-Z]*$/.test(args[1]);
        const columnNumber = parseInt((args[0].match(/\d+/) as RegExpMatchArray)[0], 10); // Prend les nombres d'un string
        const minColumnNumber = 1;
        const maxColumnNumber = (this.game as Game).config.boardSize.x;
        commandIsCorrect &&= columnNumber >= minColumnNumber && columnNumber <= maxColumnNumber;
        if (args[1].length > 1) {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            commandIsCorrect &&= /^[vh]$/.test(args[0].slice(-1));
        }
        return commandIsCorrect;
    }

    private parsePlaceCall(args: string[]): [PlacedLetter[], number[]] {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const positionNumber = (args[0].match(/\d+/) as RegExpMatchArray)[0];
        const xPositionFromNumber = parseInt(positionNumber, 10) - 1;
        const yPositionFromLetter = args[0].charCodeAt(0) - 'a'.charCodeAt(0);

        let iterationVector = new Vec2(xPositionFromNumber, yPositionFromLetter);

        let direction = new Vec2(1, 0);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (args[1].length > 1 && args[0].slice(-1) === 'v') direction = new Vec2(0, 1);

        const placableLetters: PlacedLetter[] = [];
        const blanks: number[] = [];
        const game = this.game as Game;
        for (let i = 0; i < args[1].length; i++) {
            while (game.board.letterAt(iterationVector)) iterationVector = iterationVector.add(direction);
            placableLetters.push(new PlacedLetter(stringToLetter(args[1].charAt(i)), iterationVector.copy()));
            if (/^[A-Z]*$/.test(args[1].charAt(i))) blanks.push(i);
            iterationVector = iterationVector.add(direction);
        }
        return [placableLetters, blanks];
    }

    private gameStatusGetter(playerNumber: number): unknown {
        const game = this.game as Game;
        const opponent = { ...game.players[(playerNumber + 1) % 2] };
        opponent.easel = opponent.easel.map(() => BLANK_LETTER);
        return {
            status: { activePlayer: game.players[game.activePlayer].name, letterPotLength: game.bag.letters.length },
            players: { player: game.players[playerNumber], opponent },
            board: {
                board: game.board.board,
                pointsPerLetter: Array.from(game.board.pointsPerLetter),
                multipliers: game.board.multipliers,
                blanks: game.board.blanks,
            },
        };
    }
}
