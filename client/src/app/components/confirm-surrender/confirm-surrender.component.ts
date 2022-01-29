import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-confirm-surrender',
    templateUrl: './confirm-surrender.component.html',
    styleUrls: ['./confirm-surrender.component.scss'],
})
export class ConfirmSurrenderComponent {
    socket: Socket;
    constructor(public dialogRef: MatDialogRef<ConfirmSurrenderComponent>, @Inject(MAT_DIALOG_DATA) data: Socket) {
        this.socket = data;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    surrenderGame(): void {
        this.closeDialog();
    }
}
