import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { GameMode } from '@app/classes/game-info';
import { HighScore } from '@app/classes/highscore';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard-page.component.html',
    styleUrls: ['./leaderboard-page.component.scss'],
})
export class LeaderboardPageComponent implements AfterViewInit {
    @Output() readonly buttonClick = new EventEmitter<string>();
    highScoreClassic: HighScore[];
    highScoreLog2990: HighScore[];
    displayedColumns: string[] = ['position', 'name', 'score'];

    ngAfterViewInit(): void {
        this.httpService.getHighScores(GameMode.Classical);
    }
}
