import { Component } from '@angular/core';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    players$: Observable<Players>;

    constructor(store: Store<{ players: Players }>) {
        this.players$ = store.select('players');
    }
}
