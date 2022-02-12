import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { cancelJoinRoom, joinRoom, loadRooms } from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@app/constants';
import { RoomEffects } from '@app/effects/room.effects';
import { RoomState } from '@app/reducers/room.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export const forbiddenNameValidator = (name: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = name === control.value;
        return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
};

@Component({
    selector: 'app-game-join-page',
    templateUrl: './game-join-page.component.html',
    styleUrls: ['./game-join-page.component.scss'],
})
export class GameJoinPageComponent {
    @ViewChild(MatStepper) stepper: MatStepper;

    readonly minNameLength: number = MIN_NAME_LENGTH;
    readonly maxNameLength: number = MAX_NAME_LENGTH;

    formGroup: FormGroup;
    selectedRoom: RoomInfo | undefined;
    isFormDisabled: boolean = false;

    roomList$: Observable<RoomInfo[]>;
    pendingRoom$: Observable<RoomInfo | undefined>;

    constructor(
        formBuilder: FormBuilder,
        roomStore: Store<{ room: RoomState }>,
        private store: Store,
        private effects: RoomEffects,
        dialogRef: MatDialogRef<GameJoinPageComponent>,
    ) {
        this.formGroup = formBuilder.group({ name: new FormControl({ value: '', disabled: this.isFormDisabled }) });

        this.roomList$ = roomStore.select('room', 'roomList');
        this.pendingRoom$ = roomStore.select('room', 'pendingRoom');
        this.store.dispatch(loadRooms());
        this.effects.dialogRef = dialogRef;
    }

    selectRoom(roomInfo: RoomInfo): void {
        this.selectedRoom = roomInfo;
        this.setupNameValidators(roomInfo.gameOptions.hostname);
    }

    unSelectRoom(): void {
        this.setupNameValidators('');
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

    setupNameValidators(hostName: string): void {
        this.formGroup.controls.name.clearValidators();
        this.formGroup.controls.name.setValidators([
            Validators.required,
            Validators.minLength(this.minNameLength),
            Validators.maxLength(this.maxNameLength),
            forbiddenNameValidator(hostName),
        ]);
        this.formGroup.controls.name.updateValueAndValidity();
    }
}
