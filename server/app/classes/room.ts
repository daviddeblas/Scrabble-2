import { GameConfigService } from '@app/services/game-config.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import Container from 'typedi';
import { GameOptions } from './game-options';
import { Game } from './game/game';
import { RoomInfo } from './room-info';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: Game | null;

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
            socket.on('get game status', () => {
                const game = this.game as Game;
                const opponent = { ...game.players[(index + 1) % 2] };
                opponent.easel = [];
                socket.emit('game status', {
                    status: { activePlayer: game.activePlayer, letterPotLength: game.bag.letters.length },
                    players: { player: game.players[index], opponent },
                    board: game.board,
                });
            });
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
}
