import io from 'socket.io';
import { Service } from 'typedi';
import { RoomsManager } from './rooms-manager.service';
// TODO pouvoir changer de dictionnaire

@Service()
export class BrowserService {
    tempClientSocketId: string;
    tempServerSocket: io.Socket;
    timeoutId: ReturnType<typeof setTimeout>;
    constructor(public rooms: RoomsManager) {}

    setupSocketConnection(socket: io.Socket) {
        socket.on('closed browser', (userId) => {
            this.tempClientSocketId = userId;
            this.tempServerSocket = socket;
            const maxTimeForReload = 5000;
            this.timeoutId = setTimeout(() => {
                const clientSocket = this.rooms.getOpponentSocket(socket.id);
                clientSocket?.emit('victory');
            }, maxTimeForReload);
        });

        socket.on('browser reconnection', (oldClientId) => {
            if (oldClientId === this.tempClientSocketId) {
                clearTimeout(this.timeoutId);
                socket = this.tempServerSocket;
            }
        });
    }
}
