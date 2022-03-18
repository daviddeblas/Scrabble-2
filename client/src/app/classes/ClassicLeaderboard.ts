import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { HighScore } from './highscore';

export class ClassicLeaderboard implements DataSource<HighScore> {
    highScoreClassicDB = new BehaviorSubject<HighScore[]>([] as HighScore[]);

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
