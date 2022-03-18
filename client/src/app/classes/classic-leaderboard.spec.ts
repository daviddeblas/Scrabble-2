import { BehaviorSubject } from 'rxjs';
import { ClassicLeaderboard } from './classic-leaderboard';
import { HighScore } from './highscore';

describe('Classic Leaderboard', () => {
    const expectedHighScores = [
        { name: 'name1', score: 0 },
        { name: 'name2', score: 1 },
        { name: 'name3', score: 2 },
    ] as HighScore[];
    it('should create an connect and return the Observable with  ', () => {
        const log2990Leaderboard = new ClassicLeaderboard();
        log2990Leaderboard.highScoreClassicDB = new BehaviorSubject<HighScore[]>(expectedHighScores);
        const result = log2990Leaderboard.connect();
        result.subscribe((highScores) => {
            expect(highScores).toEqual(expectedHighScores);
        });
    });

    it('should call highScoresClassicDB complete when disonnect', () => {
        const log2990Leaderboard = new ClassicLeaderboard();
        log2990Leaderboard.highScoreClassicDB = new BehaviorSubject<HighScore[]>(expectedHighScores);
        const completeSpy = spyOn(log2990Leaderboard.highScoreClassicDB, 'complete');
        log2990Leaderboard.disconnect();
        expect(completeSpy).not.toEqual(log2990Leaderboard);
    });

    it('should change the data of highScoreClassicDB', () => {
        const log2990Leaderboard = new ClassicLeaderboard();
        const startHighScores = new BehaviorSubject<HighScore[]>(expectedHighScores);
        log2990Leaderboard.highScoreClassicDB = startHighScores;
        log2990Leaderboard.changeData([]);
        expect(log2990Leaderboard.highScoreClassicDB).not.toEqual(startHighScores);
    });
});
