import http from 'http';
import io from 'socket.io';
import { Service } from 'typedi';
import { RoomsManager } from './rooms-manager.service';

@Service()
export class SocketService {
    private sio: io.Server;
    private tempClientSocketId: string;
    private tempServerSocket: io.Socket;
    private timeoutId: ReturnType<typeof setTimeout>;

    constructor(server: http.Server, public rooms: RoomsManager) {
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
            socket.on('closed browser', (userId) => {
                this.tempClientSocketId = userId;
                this.tempServerSocket = socket;
                const maxTimeForReload = 5000;
                this.timeoutId = setTimeout(() => {
                    const clientSocket = rooms.getOpponentSocket(socket.id);
                    clientSocket?.emit('victory');
                }, maxTimeForReload);
            });
            socket.on('browser reconnection', (oldClientId) => {
                if (oldClientId === this.tempClientSocketId) {
                    clearTimeout(this.timeoutId);
                    socket = this.tempServerSocket;
                }
            });
        });
    }

    isOpen(): boolean {
        return this.sio.getMaxListeners() > 0;
    }
}
