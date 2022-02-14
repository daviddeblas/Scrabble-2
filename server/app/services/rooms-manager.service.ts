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
            socket.emit('get list', this.getAvailableRooms());
        });

        socket.on('join room', (data) => {
            this.joinRoom(data.roomId, socket, data.playerName);
            socket.emit('player joining', data.playerName);
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

    joinRoom(roomId: string, socket: io.Socket, name: string): void {
        const room = this.rooms.find((r) => r.getRoomInfo().roomId === roomId);
        if (room) {
            room.join(socket, name);
        } else {
            throw new Error('Game not found');
        }
    }

    getRooms(): RoomInfo[] {
        return this.rooms.map((r) => r.getRoomInfo());
    }

    getAvailableRooms(): RoomInfo[] {
        return this.rooms.filter((r) => r.game === null).map((r) => r.getRoomInfo());
    }

    switchPlayerSocket(oldSocket: io.Socket, newSocket: io.Socket): void {
        const room = this.getRoom(oldSocket.id);
        if (!room) return;
        if (room.host.id === oldSocket.id) {
            room.host = newSocket;
            if (room.clients[0]) room.removeUnneededListeners(room.clients[0]);
        } else {
            room.clients[0] = newSocket;
            room.removeUnneededListeners(room.host);
        }
        room.initiateRoomEvents();
    }

    getRoom(playerServerId: string): Room | undefined {
        return this.rooms.find((r) => r.host.id === playerServerId || r.clients[0]?.id === playerServerId);
    }
}
