import { Injectable } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class BrowserManagerService {
    onBrowserClosed(socketService: SocketClientService): void {
        socketService.send('closed browser', socketService.socket.id);
        const date = new Date();
        const expiryTimer = 5000;
        date.setTime(date.getTime() + expiryTimer);
        const expires = '; expires=' + date.toUTCString();
        document.cookie = 'socket=' + (socketService.socket.id || '') + expires + '; path=/';
    }

    onBrowserLoad(socketService: SocketClientService): void {
        if (!socketService.isSocketAlive()) {
            socketService.connect();
            const oldSocketId = this.readCookieSocket;
            if (oldSocketId !== undefined) socketService.send('browser reconnection', oldSocketId);
        }
    }

    get readCookieSocket(): string | undefined {
        const cookieName = 'socket';
        const cookies = document.cookie.split(';');
        const socketCookie = cookies.find((cookie) => cookie.includes(cookieName));
        return socketCookie?.split('=')[1];
    }
}
