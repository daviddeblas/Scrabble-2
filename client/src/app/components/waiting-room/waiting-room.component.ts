import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { closeRoom, refuseInvite } from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { GamePreparationPageComponent } from '@app/pages/game-preparation-page/game-preparation-page.component';
import { RoomState } from '@app/reducers/room.reducer';
import { SocketClientService } from '@app/services/socket-client.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnDestroy {
    @Input() stepper: MatStepper;
    roomInfo$: Observable<RoomInfo | undefined>;
    player2$: Observable<string | undefined>;
    gameStarted: boolean;

    constructor(
        private dialogRef: MatDialogRef<GamePreparationPageComponent>,
        public socketService: SocketClientService,
        private store: Store,
        roomStore: Store<RoomState>,
    ) {
        this.roomInfo$ = roomStore.select('roomInfo');
        this.player2$ = roomStore.select('pendingPlayer');
    }

    closeDialog(): void {
        this.store.dispatch(closeRoom());
        this.dialogRef.close();
    }
    rejectInvite(): void {
        this.store.dispatch(refuseInvite());
    }

    quitWaitingRoom(): void {
        this.store.dispatch(closeRoom());
        this.stepper.reset();
    }

    ngOnDestroy(): void {
        if (!this.gameStarted) this.store.dispatch(closeRoom());
    }
}
