import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { cancelJoinRoom, joinRoom, loadRooms } from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { RoomEffects } from '@app/effects/room.effects';
import { RoomState } from '@app/reducers/room.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-game-join-page',
    templateUrl: './game-join-page.component.html',
    styleUrls: ['./game-join-page.component.scss'],
})
export class GameJoinPageComponent {
    formGroup: FormGroup;
    roomList$: Observable<RoomInfo[]>;
    pendingRooms$: Observable<RoomInfo | undefined>;

    constructor(
        formBuilder: FormBuilder,
        roomStore: Store<{ room: RoomState }>,
        private store: Store,
        private effects: RoomEffects,
        dialogRef: MatDialogRef<GameJoinPageComponent>,
    ) {
        this.formGroup = formBuilder.group({
            name: ['', Validators.required],
        });

        this.roomList$ = roomStore.select('room', 'roomList');
        this.pendingRooms$ = roomStore.select('room', 'pendingRoom');
        this.store.dispatch(loadRooms());
        this.effects.dialogRef = dialogRef;
    }

    joinGame(roomInfo: RoomInfo): void {
        this.store.dispatch(joinRoom({ playerName: this.formGroup.controls.name.value, roomInfo }));
    }

    cancelJoin(roomInfo: RoomInfo): void {
        this.store.dispatch(cancelJoinRoom({ roomInfo }));
    }
}
