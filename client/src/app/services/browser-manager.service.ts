import { Injectable } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class BrowserManagerService {
    constructor(public socketService: SocketClientService) {}
    onBrowserClosed(): void {
        this.socketService.send('closed browser', this.socketService.socket.id);
        const date = new Date();
        const expiryTimer = 5000;
        date.setTime(date.getTime() + expiryTimer);
        const expires = '; expires=' + date.toUTCString();
        document.cookie = 'socket=' + (this.socketService.socket.id || '') + expires + '; path=/';
    }

    onBrowserLoad(): void {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
            const oldSocketId = this.readCookieSocket;
            if (oldSocketId !== undefined) this.socketService.send('browser reconnection', oldSocketId);
        }
    }

    get readCookieSocket(): string | undefined {
        const cookieName = 'socket';
        const cookies = document.cookie.split(';');
        const socketCookie = cookies.find((cookie) => cookie.includes(cookieName));
        return socketCookie?.split('=')[1];
    }
}
