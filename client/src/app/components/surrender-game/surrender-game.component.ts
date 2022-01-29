import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSurrenderComponent } from '@app/components/confirm-surrender/confirm-surrender.component';
import { Socket } from 'socket.io-client';

@Component({
    selector: 'app-surrender-game',
    templateUrl: './surrender-game.component.html',
    styleUrls: ['./surrender-game.component.scss'],
})
export class SurrenderGameComponent {
    @Input() socket: Socket;
    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(ConfirmSurrenderComponent, {
            data: this.socket,
        });
    }
}
