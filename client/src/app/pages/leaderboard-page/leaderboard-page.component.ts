import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { loadLeaderboard } from '@app/actions/leaderboard.actions';
import { HighScore } from '@app/classes/highscore';
import { LeaderBoardScores } from '@app/reducers/leaderboard.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard-page.component.html',
    styleUrls: ['./leaderboard-page.component.scss'],
})
export class LeaderboardPageComponent {
    @Output() readonly buttonClick = new EventEmitter<string>();
    dataClassicLeaderBoard: MatTableDataSource<HighScore>;
    dataLog2990LeaderBoard: MatTableDataSource<HighScore>;
    displayedColumns: string[] = ['rank', 'name', 'score'];

    constructor(store: Store<{ highScores: LeaderBoardScores }>) {
        this.dataClassicLeaderBoard = new MatTableDataSource();
        this.dataLog2990LeaderBoard = new MatTableDataSource();
        store.select('highScores').subscribe((highScores) => {
            this.dataClassicLeaderBoard.data = highScores.classicHighScores;
            this.dataLog2990LeaderBoard.data = highScores.log2990HighScores;
        });
        store.dispatch(loadLeaderboard());
    }
}
