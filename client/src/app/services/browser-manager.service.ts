import { Injectable } from '@angular/core';
import { initiateChatting, restoreMessages } from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { SocketClientService } from '@app/services/socket-client.service';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BrowserManagerService {
    constructor(public socketService: SocketClientService, private store: Store, private chatStore: Store<{ chat: ChatMessage[] }>) {}
    onBrowserClosed(): void {
        this.socketService.send('closed browser', this.socketService.socket.id);
        const date = new Date();
        const expiryTimer = 5000;
        date.setTime(date.getTime() + expiryTimer);
        const expires = '; expires=' + date.toUTCString();
        document.cookie = 'socket=' + (this.socketService.socket.id || '') + expires + '; path=/';
        this.storeSelectors();
    }

    onBrowserLoad(): void {
        if (!this.socketService.isSocketAlive()) this.socketService.connect();
        const oldSocketId = this.readCookieSocket;
        if (!oldSocketId) return;
        this.socketService.send('browser reconnection', oldSocketId);
        this.store.dispatch(initiateChatting());
        this.retrieveSelectors();
    }

    private storeSelectors(): void {
        this.chatStore
            .select('chat')
            .pipe(take(1))
            .subscribe((messages) => localStorage.setItem('chatMessages', JSON.stringify(messages)));
    }

    private retrieveSelectors(): void {
        const oldMessages = localStorage.getItem('chatMessages');
        localStorage.removeItem('chatMessages');
        if (!oldMessages) return;
        this.store.dispatch(restoreMessages({ oldMessages: JSON.parse(oldMessages) }));
    }

    get readCookieSocket(): string | undefined {
        const cookieName = 'socket';
        const cookies = document.cookie.split(';');
        const socketCookie = cookies.find((cookie) => cookie.includes(cookieName));
        return socketCookie?.split('=')[1];
    }
}
