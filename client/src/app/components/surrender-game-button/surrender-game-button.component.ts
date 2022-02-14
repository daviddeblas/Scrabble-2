import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSurrenderDialogComponent } from '@app/components/confirm-surrender-dialog/confirm-surrender-dialog.component';

@Component({
    selector: 'app-surrender-game-button',
    templateUrl: './surrender-game-button.component.html',
    styleUrls: ['./surrender-game-button.component.scss'],
})
export class SurrenderGameButtonComponent {
    constructor(public dialog: MatDialog) {}

    openConfirmSurrenderDialog(): void {
        this.dialog.open(ConfirmSurrenderDialogComponent);
    }
}
