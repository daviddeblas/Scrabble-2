import { Room } from '@app/classes/room';
import { Service } from 'typedi';
import io from 'socket.io';
import { GameOptions } from '@app/classes/game-options';

@Service()
export class RoomsManager {
    rooms: Room[] = [];

    createRoom(socket: io.Socket, options: GameOptions): void {
        this.rooms.push(new Room(socket, this, options));
    }

    removeRoom(room: Room): void {
        this.rooms.splice(this.rooms.indexOf(room), 1);
    }

    joinRoom(roomId: number, socket: io.Socket, name: string): void {
        const room = this.rooms.find((r) => r.host.id === roomId.toString());
        if (room) {
            room.join(socket, name);
        } else {
            throw new Error('Game not found');
        }
    }

    getRooms(): string[] {
        return this.rooms.map((r) => r.gameOptions.hostname);
    }
}
