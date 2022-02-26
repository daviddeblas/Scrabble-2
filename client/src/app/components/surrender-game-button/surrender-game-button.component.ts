import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { resetSocketConnection } from '@app/actions/player.actions';
import { ConfirmSurrenderDialogComponent } from '@app/components/confirm-surrender-dialog/confirm-surrender-dialog.component';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-surrender-game-button',
    templateUrl: './surrender-game-button.component.html',
    styleUrls: ['./surrender-game-button.component.scss'],
})
export class SurrenderGameButtonComponent {
    gameEnded$: Observable<boolean>;

    constructor(public dialog: MatDialog, private store: Store<{ gameStatus: GameStatus }>, private router: Router) {
        this.gameEnded$ = this.store.select('gameStatus', 'gameEnded');
    }

    openConfirmSurrenderDialog(): void {
        this.dialog.open(ConfirmSurrenderDialogComponent);
    }

    quitGamePage(): void {
        this.router.navigateByUrl('/');
        this.store.dispatch(resetSocketConnection());
    }
}
