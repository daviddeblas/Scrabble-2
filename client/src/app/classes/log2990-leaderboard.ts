import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { HighScore } from './highscore';

export class Log2990Leaderboard implements DataSource<HighScore> {
    highScoreClassicDB = new BehaviorSubject<HighScore[]>([
        { name: 'name1', score: 0 },
        { name: 'name2', score: 1 },
        { name: 'name3', score: 2 },
    ] as HighScore[]);

    connect(): Observable<HighScore[]> {
        return this.highScoreClassicDB.asObservable();
    }

    disconnect(): void {
        this.highScoreClassicDB.complete();
    }

    changeData(newHighScores: HighScore[]): void {
        this.highScoreClassicDB = new BehaviorSubject<HighScore[]>(newHighScores);
    }
}
