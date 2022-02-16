import { Injectable } from '@angular/core';
import {
    createRoomSuccess,
    joinInviteCanceled,
    joinInviteReceived,
    joinRoomAccepted,
    joinRoomDeclined,
    loadRoomsSuccess,
} from '@app/actions/room.actions';
import { GameOptions } from '@app/classes/game-options';
import { RoomInfo } from '@app/classes/room-info';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    constructor(private socketService: SocketClientService, private store: Store) {}

    createRoom(gameOptions: GameOptions): void {
        this.socketService.send('create room', gameOptions);

        this.socketService.on('create room success', (roomInfo: RoomInfo) => {
            this.store.dispatch(createRoomSuccess({ roomInfo }));
            this.waitForInvitations();
        });
    }

    waitForInvitations(): void {
        this.socketService.on('player joining', (playerName: string) => {
            this.store.dispatch(joinInviteReceived({ playerName }));
        });

        this.socketService.on('player joining cancel', () => {
            this.store.dispatch(joinInviteCanceled());
        });
    }

    refuseInvite(): void {
        this.socketService.send('refuse');
    }

    acceptInvite(): void {
        this.socketService.send('accept');
    }

    closeRoom(): void {
        this.socketService.send('quit');
    }

    fetchRoomList(): void {
        this.socketService.send('request list');
        this.socketService.on('get list', (roomInfo: RoomInfo[]) => {
            this.store.dispatch(loadRoomsSuccess({ rooms: roomInfo }));
        });
    }

    joinRoom(roomInfo: RoomInfo, playerName: string): void {
        this.socketService.send('join room', { roomId: roomInfo.roomId, playerName });
        this.socketService.on('accepted', () => {
            this.store.dispatch(joinRoomAccepted({ roomInfo, playerName }));
        });
        this.socketService.on('refused', () => {
            this.store.dispatch(joinRoomDeclined({ roomInfo, playerName }));
        });
    }

    cancelJoinRoom() {
        this.socketService.send('cancel join room');
    }
}
