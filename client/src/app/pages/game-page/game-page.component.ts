import { Component, HostListener } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public socketService: SocketClientService) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.socketService.send('closed browser', this.socketService.socket.id);
        const date = new Date();
        const expiryTimer = 5000;
        date.setTime(date.getTime() + expiryTimer);
        const expires = '; expires=' + date.toUTCString();
        document.cookie = 'socket=' + (this.socketService.socket.id || '') + expires + '; path=/';
    }

    @HostListener('window:load')
    onloadHandler() {
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
