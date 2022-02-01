import { GameOptions } from '@app/classes/game-options';
import { Room } from '@app/classes/room';
import { RoomInfo } from '@app/classes/room-info';
import io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class RoomsManager {
    rooms: Room[] = [];

    setupSocketConnection(socket: io.Socket) {
        socket.on('create room', (options) => {
            socket.emit('create room success', this.createRoom(socket, options));
        });
        socket.on('request list', () => {
            socket.emit('get list', this.getRooms());
        });

        socket.on('join room', (data) => {
            this.joinRoom(data.roomId, socket, data.playerName);
            socket.emit('player arrival', data.playerName);
        });
    }

    createRoom(socket: io.Socket, options: GameOptions): RoomInfo {
        const newRoom = new Room(socket, this, options);
        this.rooms.push(newRoom);
        return newRoom.getRoomInfo();
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

    getRooms(): RoomInfo[] {
        return this.rooms.map((r) => r.getRoomInfo());
    }
}
