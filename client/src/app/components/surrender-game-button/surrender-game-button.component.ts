import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { messageWritten } from '@app/actions/chat.actions';
import { resetSocketConnection } from '@app/actions/player.actions';
import { ConfirmSurrenderDialogComponent } from '@app/components/confirm-surrender-dialog/confirm-surrender-dialog.component';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-surrender-game-button',
    templateUrl: './surrender-game-button.component.html',
    styleUrls: ['./surrender-game-button.component.scss'],
})
export class SurrenderGameButtonComponent {
    gameEnded$: Observable<boolean>;

    constructor(public dialog: MatDialog, private store: Store<{ gameStatus: GameStatus; players: Players }>, private router: Router) {
        this.gameEnded$ = this.store.select('gameStatus', 'gameEnded');
    }

    openConfirmSurrenderDialog(): void {
        this.dialog.open(ConfirmSurrenderDialogComponent);
    }

    quitGamePage(): void {
        this.store.select('players').subscribe((players) => {
            const quitMessage = { username: '', message: players.player.name + ' a quitté le jeu', messageType: 'System' };
            this.store.dispatch(messageWritten(quitMessage));
        });
        this.router.navigateByUrl('/');
        this.store.dispatch(resetSocketConnection());
    }
}
