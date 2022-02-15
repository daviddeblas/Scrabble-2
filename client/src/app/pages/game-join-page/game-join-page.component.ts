import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { cancelJoinRoom, joinRoom, loadRooms, resetRoomState } from '@app/actions/room.actions';
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

const STEPPER_WAIT = 100;

@Component({
    selector: 'app-game-join-page',
    templateUrl: './game-join-page.component.html',
    styleUrls: ['./game-join-page.component.scss'],
})
export class GameJoinPageComponent implements OnDestroy {
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
        effects: RoomEffects,
        dialogRef: MatDialogRef<GameJoinPageComponent>,
    ) {
        this.store.dispatch(resetRoomState());
        this.formGroup = formBuilder.group({ name: new FormControl({ value: '', disabled: this.isFormDisabled }) });

        this.roomList$ = roomStore.select('room', 'roomList');
        this.pendingRoom$ = roomStore.select('room', 'pendingRoom');
        this.store.dispatch(loadRooms());

        effects.dialogRef = dialogRef;
    }

    ngOnDestroy(): void {
        this.cancelJoin();
    }

    selectRoom(roomInfo: RoomInfo): void {
        this.selectedRoom = roomInfo;
        this.setupNameValidators(roomInfo.gameOptions.hostname);
        setTimeout(() => {
            this.stepper.next(), STEPPER_WAIT;
        });
    }

    unSelectRoom(): void {
        this.selectedRoom = undefined;
        this.setupNameValidators('');
    }

    joinGame(): void {
        if (!this.selectedRoom) return;
        this.store.dispatch(joinRoom({ playerName: this.formGroup.controls.name.value, roomInfo: this.selectedRoom }));
        this.formGroup.controls.name.disable();

        this.pendingRoom$.subscribe((newPendingRoom) => {
            if (!newPendingRoom) {
                this.formGroup.controls.name.enable();
                this.stepper.reset();
            }
        });
    }

    cancelJoin(): void {
        if (!this.selectedRoom) return;
        this.store.dispatch(cancelJoinRoom({ roomInfo: this.selectedRoom }));
        this.unSelectRoom();
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

    onStepChange() {
        if (this.stepper.selected?.editable) this.cancelJoin();
    }
}
