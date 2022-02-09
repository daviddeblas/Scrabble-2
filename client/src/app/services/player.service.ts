import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    constructor(private socketService: SocketClientService) {}

    surrenderGame(): void {
        this.socketService.send('surrender game');
    }
}
