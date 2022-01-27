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
        if (this.clients[0]) throw new Error('A client is already connected');
        this.host.emit('player joining', name);
        this.clients[0] = socket;
        this.host.once('accept', () => {
            this.clients[0]?.emit('accepted');
        });
        this.host.once('refuse', () => {
            this.clients[0]?.emit('refused');
            this.clients[0] = null;
        });
        this.clients[0].once('quit', () => {
            this.manager.removeRoom(this);
        });
    }
}
