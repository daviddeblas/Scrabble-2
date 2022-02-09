import io from 'socket.io';
import { Service } from 'typedi';
import { RoomsManager } from './rooms-manager.service';

@Service()
export class BrowserService {
    tempClientSocketId: string;
    tempServerSocket: io.Socket;
    timeoutId: ReturnType<typeof setTimeout>;

    setupSocketConnection(socket: io.Socket) {
        socket.on('closed browser', (userId) => {
            this.tempClientSocketId = userId;
            this.tempServerSocket = socket;
            const maxTimeForReload = 5000;
            this.timeoutId = setTimeout(() => {
                const room = RoomsManager.getInstance().getRoom(socket.id);
                room?.surrenderGame(socket.id);
            }, maxTimeForReload);
        });

        socket.on('browser reconnection', (oldClientId) => {
            if (oldClientId === this.tempClientSocketId) {
                clearTimeout(this.timeoutId);
                const roomsManager = RoomsManager.getInstance();
                roomsManager.switchPlayerSocket(this.tempServerSocket, socket);
            }
        });
    }
}
