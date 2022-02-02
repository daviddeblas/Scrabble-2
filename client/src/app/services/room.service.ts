import { Injectable } from '@angular/core';
import { createRoomSuccess, joinInviteReceived, loadRoomsSuccess } from '@app/actions/room.actions';
import { GameOptions } from '@app/classes/game-options';
import { RoomInfo } from '@app/classes/room-info';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    constructor(private socketService: SocketClientService, private store: Store) {}

    createRoom(gameOptions: GameOptions) {
        this.socketService.send('create room', gameOptions);

        this.socketService.on('create room success', (roomInfo: RoomInfo) => {
            this.store.dispatch(createRoomSuccess({ roomInfo }));
        });
    }

    waitForInvitations() {
        this.socketService.on('player joining', (playerName: string) => {
            this.store.dispatch(joinInviteReceived({ playerName }));
        });
    }

    refuseInvite() {
        this.socketService.send('refuse');
    }

    acceptInvite() {
        this.socketService.send('accept');
    }

    closeRoom() {
        this.socketService.send('quit');
    }

    fetchRoomList() {
        this.socketService.send('request list');
        this.socketService.on('get list', (roomInfo: RoomInfo[]) => {
            this.store.dispatch(loadRoomsSuccess({ rooms: roomInfo }));
        });
    }
}
