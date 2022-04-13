import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { loadBotNames, resetBotNames } from '@app/actions/bot-names.actions';
import { BotNames } from '@app/interfaces/bot-names';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-bot-name-admin',
    templateUrl: './bot-name-admin.component.html',
    styleUrls: ['./bot-name-admin.component.scss'],
})
export class BotAdminComponent {
    botNames$: Observable<BotNames>;

    constructor(private store: Store<{ botNames: BotNames }>, public dialog: MatDialog) {
        this.botNames$ = store.select('botNames');
        store.dispatch(loadBotNames());
    }

    reset() {
        this.store.dispatch(resetBotNames());
    }

    add() {
        return;
    }

    // eslint-disable-next-line no-unused-vars
    edit(_index: number, _difficulty: string) {
        return;
    }

    // eslint-disable-next-line no-unused-vars
    delete(_index: number, _difficulty: string) {
        return;
    }
}
