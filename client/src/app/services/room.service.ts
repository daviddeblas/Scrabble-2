import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    closeRoom,
    createRoomSuccess,
    joinInviteCanceled,
    joinInviteReceived,
    joinRoomAccepted,
    joinRoomDeclined,
    loadRoomsSuccess,
} from '@app/actions/room.actions';
import { Store } from '@ngrx/store';
import { GameOptions } from 'common/classes/game-options';
import { RoomInfo } from 'common/classes/room-info';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    constructor(private socketService: SocketClientService, private store: Store, private snackBar: MatSnackBar) {}

    createRoom(gameOptions: GameOptions): void {
        this.socketService.send('create room', gameOptions);

        this.socketService.on('create room success', (roomInfo: RoomInfo) => {
            this.store.dispatch(createRoomSuccess({ roomInfo }));
            this.waitForInvitations();
        });

        this.socketService.on('dictionary deleted', (deletedDictionaryName: string) => {
            if (gameOptions.dictionaryType === deletedDictionaryName) {
                this.store.dispatch(closeRoom());
                const error = 'Dictionnaire utilisé supprimé';
                this.sendErrorMessage(error);
            }
        });
    }

    createSoloRoom(gameOptions: GameOptions, botLevel: string): void {
        this.socketService.send('create solo room', { gameOptions, botLevel });
        this.socketService.on('create solo room success', (roomInfo: RoomInfo) => {
            this.store.dispatch(createRoomSuccess({ roomInfo }));
        });
    }

    switchToSoloRoom(botLevel: string): void {
        this.socketService.send('switch to solo room', { botLevel });
        this.socketService.on('switched to solo', (roomInfo: RoomInfo) => {
            this.store.dispatch(createRoomSuccess({ roomInfo }));
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
            const error = "Refusée par l'hôte";
            this.sendErrorMessage(error);
        });
        this.socketService.on('dictionary deleted', (deletedDictionaryName: string) => {
            if (roomInfo.gameOptions.dictionaryType === deletedDictionaryName) {
                this.store.dispatch(joinInviteCanceled());
                const error = 'Dictionnaire utilisé supprimé';
                this.sendErrorMessage(error);
            }
        });
    }

    cancelJoinRoom() {
        this.socketService.send('cancel join room');
    }

    private sendErrorMessage(message: string): void {
        const durationMilliseconds = 3000;
        this.snackBar.open(message, undefined, { duration: durationMilliseconds });
    }
}
