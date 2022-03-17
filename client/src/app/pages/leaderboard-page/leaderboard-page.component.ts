import { Component, EventEmitter, Output } from '@angular/core';
import { HighScore } from '@app/classes/highscore';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard-page.component.html',
    styleUrls: ['./leaderboard-page.component.scss'],
})
export class LeaderboardPageComponent {
    @Output() readonly buttonClick = new EventEmitter<string>();
    highScoreClassic: HighScore[];
    highScoreLog2990: HighScore[];
    displayedColumns: string[] = ['rank', 'name', 'score'];
}
