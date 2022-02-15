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
            const room = this.roomsManager.getRoom(socket.id);
            if (room?.game === null) {
                room?.quitRoomHost();
                return;
            }

            this.tempClientSocketId = userId;
            this.tempServerSocket = socket;
            const maxTimeForReload = 5000;
            this.timeoutId = setTimeout(() => {
                room?.surrenderGame(socket.id);
            }, maxTimeForReload);
        });

        socket.on('browser reconnection', (oldClientId) => {
            if (oldClientId === this.tempClientSocketId) {
                clearTimeout(this.timeoutId);
                this.roomsManager.switchPlayerSocket(this.tempServerSocket, socket);
            }
        });
    }
}
