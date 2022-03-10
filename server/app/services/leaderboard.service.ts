import { GameMode } from '@app/classes/game-configs';
import { DATABASE, DEFAULT_HIGHSCORE, HighScore } from '@app/classes/highscore';
import { Db } from 'mongodb';

export class LeaderboardService {
    private highScoreDB: Db;

    async getHighscores(): Promise<HighScore[]> {
        return this.highScoreDB
            .collection(DATABASE.highScore.collections[GameMode === GameMode.Classical ? 'classical' : 'log2990'])
            .find({})
            .sort({ score: -1 })
            .toArray()
            .then((score: HighScore[]) => {
                return score;
            });
    }

    async addDefaultScores(): Promise<void> {
        await Promise.all([
            this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertMany(DEFAULT_HIGHSCORE.classical),
            this.highScoreDB.collection(DATABASE.highScore.collections.log2290).insertMany(DEFAULT_HIGHSCORE.log2990),
        ]);
    }
}
