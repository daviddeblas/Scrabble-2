import { Injectable } from '@angular/core';
import { GameOptions } from '@app/classes/game-options';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    constructor(private socketService: SocketClientService) {}

    createRoom(gameOptions: GameOptions) {
        this.socketService.send('create room', gameOptions);
    }
}
