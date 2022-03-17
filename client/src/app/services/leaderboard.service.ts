import { Injectable } from '@angular/core';
import { loadLeaderboardSuccess } from '@app/actions/leaderboard.actions';
import { HighScore } from '@app/classes/highscore';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    constructor(private socketService: SocketClientService, private store: Store) {}

    getLeaderboard(): void {
        this.socketService.send('get highscores');

        this.socketService.on('receive highscores', (scores: HighScore[]) => {
            this.store.dispatch(loadLeaderboardSuccess({ scores }));
        });
    }
}
