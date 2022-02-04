/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { acceptInvite, closeRoom, createRoom, joinRoom, loadRooms, refuseInvite } from '@app/actions/room.actions';
import { RoomService } from '@app/services/room.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
@Injectable()
export class RoomEffects {
    createRoomEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(createRoom),
                tap((action) => {
                    this.roomService.createRoom(action.gameOptions);
                }),
            ),
        { dispatch: false },
    );

    closeRoomEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(closeRoom),
                tap(() => {
                    this.roomService.closeRoom();
                }),
            ),
        { dispatch: false },
    );

    refuseInviteEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(refuseInvite),
                tap(() => {
                    this.roomService.refuseInvite();
                }),
            ),
        { dispatch: false },
    );

    acceptInviteEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(acceptInvite),
                tap(() => {
                    this.roomService.acceptInvite();
                }),
            ),
        { dispatch: false },
    );

    loadRoomsEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loadRooms),
                tap(() => {
                    this.roomService.fetchRoomList();
                }),
            ),
        { dispatch: false },
    );

    joinRoomEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(joinRoom),
                tap((action) => {
                    this.roomService.joinRoom(action.roomInfo, action.playerName);
                }),
            ),
        { dispatch: false },
    );

    constructor(private actions$: Actions, private roomService: RoomService) {}
}
