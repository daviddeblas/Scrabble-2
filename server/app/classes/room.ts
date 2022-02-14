import { GameConfigService } from '@app/services/game-config.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import Container from 'typedi';
import { GameFinishStatus } from './game-finish-status';
import { GameOptions } from './game-options';
import { Game } from './game/game';
import { RoomInfo } from './room-info';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: Game | null;

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
        client.once('quit', () => this.quitRoomClient());
    }

    quitRoomHost(): void {
        this.manager.removeRoom(this);
    }

    inviteAccepted(client: io.Socket): void {
        client.emit('accepted');
        this.initiateRoomEvents();
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
            socket.on('get game status', () => {
                const game = this.game as Game;
                const opponent = { ...game.players[(index + 1) % 2] };
                opponent.easel = [];
                socket.emit('game status', {
                    status: { activePlayer: game.players[game.activePlayer].name, letterPotLength: game.bag.letters.length },
                    players: { player: game.players[index], opponent },
                    board: { board: game.board.board, pointsPerLetter: game.board.pointsPerLetter, multipliers: game.board.multipliers },
                });
            });
        });
    }

    initSurrenderGame(): void {
        this.sockets.forEach((socket) => {
            socket.on('surrender game', () => {
                this.surrenderGame(socket.id);
            });
        });
    }

    surrenderGame(looserId: string) {
        if (!this.game?.players) throw new Error('Game does not exist');
        const gameFinishStatus: GameFinishStatus = new GameFinishStatus(
            this.game.players,
            looserId === this.host.id ? this.clientName : this.gameOptions.hostname,
        );
        this.sockets.forEach((socket) => {
            socket.emit('end game', gameFinishStatus);
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

    removeUnneededListeners(socket: io.Socket): void {
        socket.removeAllListeners('send message').removeAllListeners('surrender game').removeAllListeners('get game status');
    }
}
