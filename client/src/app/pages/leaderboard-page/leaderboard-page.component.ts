import { Component, EventEmitter, Output } from '@angular/core';
import { loadLeaderboard } from '@app/actions/leaderboard.actions';
import { ClassicLeaderboard } from '@app/classes/ClassicLeaderboard';
import { Log2990Leaderboard } from '@app/classes/LOG2990Leaderboard';
import { LeaderBoardScores } from '@app/reducers/leaderboard.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard-page.component.html',
    styleUrls: ['./leaderboard-page.component.scss'],
})
export class LeaderboardPageComponent {
    @Output() readonly buttonClick = new EventEmitter<string>();
    dataClassicLeaderBoard: ClassicLeaderboard = new ClassicLeaderboard();
    dataLog2990LeaderBoard: Log2990Leaderboard = new Log2990Leaderboard();
    displayedColumns: string[] = ['rank', 'name', 'score'];

    constructor(store: Store<{ highScores: LeaderBoardScores }>) {
        store.select('highScores').subscribe((highScores) => {
            this.dataClassicLeaderBoard.changeData(highScores.classicHighScores);
            this.dataLog2990LeaderBoard.changeData(highScores.log2990HighScores);
        });
        store.dispatch(loadLeaderboard());
    }
}
