import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { acceptInvite, closeRoom, refuseInvite, switchToSoloRoom } from '@app/actions/room.actions';
import { GamePreparationPageComponent } from '@app/pages/game-preparation-page/game-preparation-page.component';
import { RoomState } from '@app/reducers/room.reducer';
import { SocketClientService } from '@app/services/socket-client.service';
import { Store } from '@ngrx/store';
import { RoomInfo } from 'common/classes/room-info';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnDestroy, OnInit {
    @Input() stepper: MatStepper;
    roomInfo$: Observable<RoomInfo | undefined>;
    player2$: Observable<string | undefined>;
    gameStarted: boolean;
    settingsForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<GamePreparationPageComponent>,
        public socketService: SocketClientService,
        private store: Store,
        roomStore: Store<{ room: RoomState }>,
    ) {
        this.roomInfo$ = roomStore.select('room', 'roomInfo');
        this.player2$ = roomStore.select('room', 'pendingPlayer');
        this.gameStarted = false;
    }

    ngOnInit() {
        this.settingsForm = this.fb.group({
            botLevel: ['Débutant'],
        });
    }

    acceptInvite(): void {
        this.store.dispatch(acceptInvite());
        this.gameStarted = true;
        this.dialogRef.close();
    }
    rejectInvite(): void {
        this.store.dispatch(refuseInvite());
    }

    quitWaitingRoom(): void {
        this.store.dispatch(closeRoom());
        this.stepper.reset();
    }

    convertToSolo(): void {
        this.store.dispatch(switchToSoloRoom({ botLevel: this.settingsForm.controls.botLevel.value }));
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        if (!this.gameStarted) this.store.dispatch(closeRoom());
    }
}
