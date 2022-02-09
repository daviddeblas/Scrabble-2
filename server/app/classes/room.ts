import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import { ClassicGame } from './classic-game';
import { GameFinishStatus } from './game-finish-status';
import { GameOptions } from './game-options';
import { RoomInfo } from './room-info';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: ClassicGame | null;

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

    endGame(info: GameFinishStatus): void {
        this.sockets.forEach((socket) => {
            socket.emit('end game', info);
        });
    }

    initGame(): void {
        this.sockets = [this.host, this.clients[0] as io.Socket];
        this.game = new ClassicGame(this.endGame);
        this.game.players[0].name = this.gameOptions.hostname;
        this.game.players[1].name = this.clientName as string;
        this.sockets.forEach((socket, index) => {
            socket.on('get game status', () => {
                if (this.game === null) throw new Error();
                socket.emit('game status', {
                    playerNames: [this.game.players[0].name, this.game.players[1].name],
                    thisPlayer: index,
                    playerEasel: this.game.players[index].easel,
                    board: this.game.board,
                    multipliers: this.game.multipliers,
                    activePlayer: this.game.activePlayer,
                    letterPotLength: this.game.letterPot.length,
                    pointsPerLetter: this.game.pointPerLetter,
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
