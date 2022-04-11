import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { loadBotNames } from '@app/actions/bot-names.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-bot-name-admin',
    templateUrl: './bot-name-admin.component.html',
    styleUrls: ['./bot-name-admin.component.scss'],
})
export class BotAdminComponent {
    botNames$: Observable<string[]>;

    constructor(private store: Store<{ botNames: string[] }>, public dialog: MatDialog) {
        this.botNames$ = store.select('botNames');
        store.dispatch(loadBotNames());
    }
}
