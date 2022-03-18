import { Injectable } from '@angular/core';
import { loadClassicLeaderboardSuccess, loadLog2990LeaderboardSuccess } from '@app/actions/leaderboard.actions';
import { HighScore } from '@app/classes/highscore';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    constructor(private socketService: SocketClientService, private store: Store<{ highScores: HighScore[] }>) {}

    getLeaderboard(): void {
        this.socketService.send('get highscores');

        this.socketService.on('receive classic highscores', (scores: HighScore[]) => {
            this.store.dispatch(loadClassicLeaderboardSuccess({ highScores: scores }));
        });

        this.socketService.on('receive log2990 highscores', (scores: HighScore[]) => {
            this.store.dispatch(loadLog2990LeaderboardSuccess({ highScores: scores }));
        });
    }
}
