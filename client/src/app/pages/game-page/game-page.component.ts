import { Component } from '@angular/core';
import { BrowserManagerService } from '@app/services/browser-manager.service';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public socketService: SocketClientService, public browserManager: BrowserManagerService) {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            this.browserManager.onBrowserClosed(this.socketService);
        });
        window.addEventListener('load', (event) => {
            event.preventDefault();
            this.browserManager.onBrowserLoad(this.socketService);
        });
    }
}
