import http from 'http';
import io from 'socket.io';
import { Service } from 'typedi';
import { RoomManager } from './rooms-manager.service';

@Service()
export class SocketService {
    private sio: io.Server;

    constructor(server: http.Server, public rooms: RoomManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.sio.on('connection', (socket) => {
            socket.on('create room', (options) => {
                rooms.createRoom(socket, options);
                socket.emit('game settings', options);
            });
            socket.on('request list', () => {
                socket.emit('get list', rooms.getRooms());
            });
            socket.on('get dictionaries', () => {
                socket.emit('receive dictionaries', ['Mon dictionnaire']);
            });
            socket.on('join room', (data) => {
                this.rooms.joinRoom(data.roomId, socket, data.playerName);
                socket.emit('player arrival', data.playerName);
            });
        });
    }
}
