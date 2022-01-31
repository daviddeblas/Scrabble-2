import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSurrenderDialogComponent } from '@app/components/confirm-surrender-dialog/confirm-surrender-dialog.component';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-surrender-game-button',
    templateUrl: './surrender-game-button.component.html',
    styleUrls: ['./surrender-game-button.component.scss'],
})
export class SurrenderGameButtonComponent {
    @Input() socket: Socket;
    constructor(public dialog: MatDialog) {}

    openConfirmSurrenderDialog(): void {
        this.dialog.open(ConfirmSurrenderDialogComponent, {
            data: this.socket,
        });
    }
}
