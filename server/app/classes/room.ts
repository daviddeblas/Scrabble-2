import { RoomsManager } from '@app/services/rooms-manager.service';
import io from 'socket.io';
import { GameOptions } from './game-options';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    // TODO supprimer des rooms
    constructor(public host: io.Socket, public manager: RoomsManager, public gameOptions: GameOptions) {
        this.clients = new Array(1);
        this.started = false;
        this.host.once('quit', () => {
            this.manager.removeRoom(this);
        });
    }

    join(socket: io.Socket, name: string): void {
        this.host.emit('player joining', name);
        this.clients[0] = socket;
        const client = socket;
        this.host.once('accept', () => {
            client.emit('accepted');
        });
        this.host.once('refuse', () => {
            client.emit('refused');
            this.clients[0] = null;
        });
        client.once('quit', () => {
            this.manager.removeRoom(this);
        });
    }
}
