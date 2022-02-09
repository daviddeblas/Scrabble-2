import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
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
    @ViewChild(MatStepper) stepper: MatStepper;

    formGroup: FormGroup;
    selectedRoom: RoomInfo | undefined;
    isFormDisabled: boolean = false;

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
            name: new FormControl({ value: '', disabled: this.isFormDisabled }),
        });

        this.roomList$ = roomStore.select('room', 'roomList');
        this.pendingRooms$ = roomStore.select('room', 'pendingRoom');
        this.store.dispatch(loadRooms());
        this.effects.dialogRef = dialogRef;
    }

    selectRoom(roomInfo: RoomInfo): void {
        this.selectedRoom = roomInfo;
    }

    joinGame(): void {
        if (this.selectedRoom) this.store.dispatch(joinRoom({ playerName: this.formGroup.controls.name.value, roomInfo: this.selectedRoom }));
        this.formGroup.controls.name.disable();
    }

    cancelJoin(): void {
        if (this.selectedRoom) this.store.dispatch(cancelJoinRoom({ roomInfo: this.selectedRoom }));
        this.selectedRoom = undefined;
        this.formGroup.controls.name.enable();
        this.stepper.reset();
    }
}
