import { Service } from 'typedi';
import io from 'socket.io';
import http from 'http';
import { RoomManager } from './rooms-manager.service';

@Service()
export class SocketService {
    private sio: io.Server;

    constructor(server: http.Server, public rooms: RoomManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.sio.on('connection', (socket) => {
            socket.on('create room', (options) => {
                rooms.createRoom(socket, options);
            });
            socket.on('request list', () => {
                socket.emit('get list', rooms.getRooms());
            });
        });
    }
}
