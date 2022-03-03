import { CommandService } from '@app/services/command.service';
import { GameConfigService } from '@app/services/game-config.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import { GameOptions } from 'common/classes/game-options';
import { RoomInfo } from 'common/classes/room-info';
import io from 'socket.io';
import { Container } from 'typedi';
import { GameFinishStatus } from './game-finish-status';
import { GameError, GameErrorType } from './game.exception';
import { Game } from './game/game';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: Game | null;
    commandService: CommandService;

    sockets: io.Socket[];
    constructor(public host: io.Socket, public manager: RoomsManager, public gameOptions: GameOptions) {
        this.clients = new Array(1);
        this.started = false;
        this.host.once('quit', () => this.quitRoomHost());
        this.game = null;
        this.clientName = null;
        this.commandService = Container.get(CommandService);
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
        this.initGame();
    }

    inviteRefused(client: io.Socket): void {
        client.emit('refused');
        this.clients[0] = null;
        this.clientName = null;
    }

    quitRoomClient(): void {
        if (this.game !== null) return;
        this.host.emit('player joining cancel');
        this.clients[0] = null;
        this.clientName = null;
    }

    initiateRoomEvents() {
        this.sockets = [this.host, this.clients[0] as io.Socket];
        this.sockets.forEach((s, i) => {
            this.setupSocket(s, i);
        });
    }

    initGame(): void {
        this.sockets = [this.host, this.clients[0] as io.Socket];

        this.game = new Game(
            Container.get(GameConfigService).configs.configs[0],
            [this.gameOptions.hostname, this.clientName as string],
            this.gameOptions,
            this.actionAfterTimeout,
        );

        this.manager.removeSocketFromJoiningList(this.sockets[1]);
        this.manager.notifyAvailableRoomsChange();

        this.initiateRoomEvents();
    }

    surrenderGame(looserId: string) {
        if (!this.game?.players) throw new GameError(GameErrorType.GameNotExists);

        const gameFinishStatus: GameFinishStatus = new GameFinishStatus(
            this.game.players,
            this.game.bag.letters.length,
            looserId === this.host.id ? this.clientName : this.gameOptions.hostname,
        );
        this.game.stopTimer();
        this.sockets.forEach((socket, index) => {
            socket.emit('end game', gameFinishStatus.toEndGameStatus(index));
        });
    }

    getRoomInfo(): RoomInfo {
        return new RoomInfo(this.host.id, this.gameOptions);
    }

    removeUnneededListeners(socket: io.Socket): void {
        socket
            .removeAllListeners('send message')
            .removeAllListeners('surrender game')
            .removeAllListeners('get game status')
            .removeAllListeners('command');
    }

    private setupSocket(socket: io.Socket, playerNumber: number): void {
        const game = this.game as Game;

        socket.on('get game status', () => {
            socket.emit('game status', game.getGameStatus(playerNumber));
        });

        // Init command processing
        socket.on('command', (command) => this.commandService.onCommand(this.game as Game, this.sockets, command, playerNumber));

        // Init Chat
        socket.on('send message', ({ username, message, messageType }) => {
            this.sockets.forEach((s, i) => {
                if (i !== playerNumber) s.emit('receive message', { username, message, messageType });
            });
        });

        // Init surrender game
        socket.on('surrender game', () => {
            this.surrenderGame(socket.id);
        });
    }

    private actionAfterTimeout(): void {
        const game = this.game as Game;
        this.commandService.processSkip(game, this.sockets, [], game.activePlayer as number);
        this.commandService.postCommand(game, this.sockets);
        if (game.needsToEnd()) {
            this.commandService.endGame(game, this.sockets);
        }
    }
}
