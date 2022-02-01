import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import { GameOptions } from './game-options';
import { RoomInfo } from './room-info';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    // TODO supprimer des rooms
    constructor(public host: io.Socket, public manager: RoomsManager, public gameOptions: GameOptions) {
        this.clients = new Array(1);
        this.started = false;
        this.host.once('quit', () => this.quitRoomHost());
    }

    join(socket: io.Socket, name: string): void {
        this.host.emit('player joining', name);
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
    }

    inviteRefused(client: io.Socket): void {
        client.emit('refused');
        this.clients[0] = null;
    }

    quitRoomClient(): void {
        this.manager.removeRoom(this);
    }

    getRoomInfo(): RoomInfo {
        return new RoomInfo(this.host.id, this.gameOptions);
    }
}
