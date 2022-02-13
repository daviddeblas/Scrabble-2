import { GameConfigService } from '@app/services/game-config.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import Container from 'typedi';
import { PlacedLetter } from './placed-letter';
import { Vec2 } from './vec2';
import { stringToLetter, stringToLetters } from './letter';
import { GameOptions } from './game-options';
import { Game } from './game/game';
import { RoomInfo } from './room-info';

const MILLISECONDS_PER_SEC = 1000;

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: Game | null;
    currentTimer: NodeJS.Timeout;

    sockets: io.Socket[];
    // TODO supprimer des rooms
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
        client.once('quit', () => this.quitRoomClient());
    }

    quitRoomHost(): void {
        this.manager.removeRoom(this);
    }

    inviteAccepted(client: io.Socket): void {
        client.emit('accepted');
        this.initGame();
        this.initChatting();
    }

    initGame(): void {
        this.sockets = [this.host, this.clients[0] as io.Socket];
        this.game = new Game(Container.get(GameConfigService).configs.configs[0], [this.gameOptions.hostname, this.clientName as string]);
        this.game.players[0].name = this.gameOptions.hostname;
        this.game.players[1].name = this.clientName as string;
        this.sockets.forEach((socket, index) => {
            this.setupSocket(socket, index);
        });
    }

    initChatting(): void {
        this.host.on('send message', ({ username, message }) => {
            this.clients[0]?.emit('receive message', { username, message });
        });
        this.clients[0]?.on('send message', ({ username, message }) => {
            this.host.emit('receive message', { username, message });
        });
    }

    inviteRefused(client: io.Socket): void {
        client.emit('refused');
        this.clients[0] = null;
        this.clientName = null;
    }

    quitRoomClient(): void {
        this.manager.removeRoom(this);
    }

    getRoomInfo(): RoomInfo {
        return new RoomInfo(this.host.id, this.gameOptions);
    }

    private setupSocket(socket: io.Socket, playerNumber: number): void {
        socket.on('get game status', () => {
            socket.emit('game status', this.gameStatusGetter(playerNumber));
        });
        socket.on('command', (command) => {
            try {
                this.processCommand(command, playerNumber);
                this.postCommand();
            } catch (error) {
                socket.emit('error', (error as Error).message);
            }
            if (this.game?.gameEnded()) {
                this.sockets.forEach((s) => {
                    s.emit('game ended', this.game?.endGame());
                });
            }
        });
    }

    private postCommand(): void {
        clearTimeout(this.currentTimer);
        this.sockets.forEach((s) => s.emit('turn ended'));
        this.currentTimer = setTimeout(() => {
            this.processSkip([], this.game?.activePlayer as number);
            this.sockets.forEach((s) => s.emit('turn ended'));
        }, this.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
    }

    private processCommand(fullCommand: string, playerNumber: number): void {
        const [command, ...args] = fullCommand.split(' ');
        switch (command) {
            case 'place':
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
        if (!this.validatePlace(args)) throw Error('malformed arguments for place');
        this.game?.place(this.parsePlaceCall(args), playerNumber);
        this.sockets.forEach((s) => {
            s.emit('place success', { args, playerNumber });
        });
    }

    private processDraw(args: string[], playerNumber: number): void {
        if (!(/^[a-z]*$/.test(args[0]) && args.length === 1)) throw Error('malformed argument for exchange');
        this.game?.draw(stringToLetters(args[0]), playerNumber);
        this.sockets.forEach((s, i) => {
            if (i === playerNumber) s.emit('draw success', { letters: args[0], playerNumber });
            else s.emit('draw success', { letters: args[0].split('').map(() => '#'), playerNumber });
        });
    }

    private processSkip(args: string[], playerNumber: number): void {
        if (args.length > 0) throw new Error('malformed argument for pass');
        this.game?.skip(playerNumber);
        this.sockets.forEach((s) => {
            s.emit('skip success', playerNumber);
        });
    }

    private validatePlace(args: string[]): boolean {
        let commandIsCorrect = false;
        if (!(args.length === 3)) return false;

        commandIsCorrect = true;
        commandIsCorrect &&= /^[a-o]*$/.test(args[0][0]);
        commandIsCorrect &&= /^[a-z0-9]*$/.test(args[0]);
        commandIsCorrect &&= /^[a-z*]*$/.test(args[1]);
        const columnNumber = parseInt((args[0].match(/\D+/) as RegExpMatchArray)[0], 10); // Prend les nombres d'un string
        const minColumnNumber = 1;
        const maxColumnNumber = (this.game as Game).config.boardSize.x;
        commandIsCorrect &&= columnNumber >= minColumnNumber && columnNumber <= maxColumnNumber;
        if (args[1].length > 1) {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            commandIsCorrect &&= /^[vh]$/.test(args[0].slice(-1));
        }
        return commandIsCorrect;
    }

    private parsePlaceCall(args: string[]): PlacedLetter[] {
        const xPositionFromLetter = args[0].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        const yPositionFromNumber = parseInt((args[0].match(/\D+/) as RegExpMatchArray)[0], 10);
        let iterationVector = new Vec2(xPositionFromLetter, yPositionFromNumber);

        let direction = new Vec2(1, 0);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (args[1].length > 1 && args[0].slice(-1) === 'v') direction = new Vec2(0, 1);

        const placableLetters: PlacedLetter[] = [];
        for (let i = 0; i < args[1].length; i++) {
            while (this.game?.board.letterAt(iterationVector)) iterationVector = iterationVector.add(direction);
            placableLetters.push(new PlacedLetter(stringToLetter(args[1].charAt(i)), iterationVector.copy()));
        }
        return placableLetters;
    }

    private gameStatusGetter(playerNumber: number): unknown {
        const game = this.game as Game;
        return {
            playerNames: [game.players[0].name, game.players[1].name],
            thisPlayer: playerNumber,
            playerEasel: game.players[playerNumber].easel,
            board: game.board,
            activePlayer: game.activePlayer,
            letterPotLength: game.bag.letters.length,
            pointsPerLetter: game.board.pointsPerLetter,
        };
    }
}
