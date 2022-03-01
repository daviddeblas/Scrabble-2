import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { zoomIn, zoomOut } from '@app/actions/local-settings.actions';
import { Player } from '@app/classes/player';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

const INTERVAL_MILLISECONDS = 1000;
const SECONDS_IN_MINUTE = 60;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    players$: Observable<Players>;
    gameStatus$: Observable<GameStatus>;
    activePlayer: string;

    countdown: number = 0;
    interval: ReturnType<typeof setInterval>;
    @HostListener('window:beforeunload', ['$event'])
    storeTimerUnLoad($event: Event): void {
        $event.preventDefault();
        const date = new Date();
        localStorage.setItem('currentTimer', JSON.stringify({countdown:this.countdown, date: date.getTime()}))
    }


    constructor(private store: Store<{ players: Players; gameStatus: GameStatus }>) {
        this.players$ = store.select('players');
        this.gameStatus$ = store.select('gameStatus');
        this.gameStatus$.subscribe((state) => {
            if (state) this.activePlayer = state.activePlayer;
            this.countdown = state.timer;
        });
    }

    ngOnInit(): void {
        this.interval = setInterval(this.decrementCountdown(), INTERVAL_MILLISECONDS);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    zoomIn(): void {
        this.store.dispatch(zoomIn());
    }

    zoomOut(): void {
        this.store.dispatch(zoomOut());
    }

    isActivePlayer(player: Player | undefined): boolean {
        if (!player) return false;
        return player.name === this.activePlayer;
    }

    decrementCountdown(): () => void {
        const self = this;
        return () => {
            self.countdown = self.countdown > 0 ? self.countdown - 1 : 0;
        };
    }

    timerToString(): string {
        return `${Math.floor(this.countdown / SECONDS_IN_MINUTE)}:${(this.countdown % SECONDS_IN_MINUTE).toString().padStart(2, '0')}`;
    }
}
