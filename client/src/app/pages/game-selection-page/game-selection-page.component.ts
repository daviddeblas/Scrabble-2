import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamePreparationPageComponent } from '@app/pages/game-preparation-page/game-preparation-page.component';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent {
    constructor(public dialog: MatDialog) {}
    openGamePreparationPage() {
        this.dialog.open(GamePreparationPageComponent);
    }
}
