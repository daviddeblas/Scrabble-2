import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-confirm-surrender-dialog',
    templateUrl: './confirm-surrender-dialog.component.html',
    styleUrls: ['./confirm-surrender-dialog.component.scss'],
})
export class ConfirmSurrenderDialogComponent {
    socket: Socket;
    constructor(public dialogRef: MatDialogRef<ConfirmSurrenderDialogComponent>, @Inject(MAT_DIALOG_DATA) data: Socket) {
        this.socket = data;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    surrenderGame(): void {
        this.closeDialog();
    }
}
