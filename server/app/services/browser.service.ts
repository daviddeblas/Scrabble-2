import io from 'socket.io';
import { Container, Service } from 'typedi';
import { RoomsManager } from './rooms-manager.service';

@Service()
export class BrowserService {
    tempClientSocketId: string;
    tempServerSocket: io.Socket;
    timeoutId: ReturnType<typeof setTimeout>;
    roomsManager = Container.get(RoomsManager);

    setupSocketConnection(socket: io.Socket) {
        socket.on('closed browser', (userId) => {
            this.tempClientSocketId = userId;
            this.tempServerSocket = socket;
            const maxTimeForReload = 5000;
            this.timeoutId = setTimeout(() => {
                const room = this.roomsManager.getRoom(socket.id);
                room?.surrenderGame(socket.id);
            }, maxTimeForReload);
        });

        socket.on('browser reconnection', (oldClientId) => {
            if (oldClientId === this.tempClientSocketId) {
                console.log(this.roomsManager.rooms);
                clearTimeout(this.timeoutId);
                this.roomsManager.switchPlayerSocket(this.tempServerSocket, socket);
            }
        });
    }
}
