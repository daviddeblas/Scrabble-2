import io from 'socket.io';
import { Service } from 'typedi';

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
                socket.emit('surrender game');
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
