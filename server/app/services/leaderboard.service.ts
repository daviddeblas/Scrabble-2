import { GameMode } from '@app/classes/game-configs';
import { DATABASE, DEFAULT_HIGHSCORE, HighScore } from '@app/classes/highscore';
import { Db, Document } from 'mongodb';

export class LeaderboardService {
    private highScore_DB: Db;

    // async getHighscores(gameMode: number): Promise<HighScore[]> {
    //     return this.highScore_DB
    //         .collection(DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'])
    //         .find({})
    //         .sort({ score: -1 })
    //         .toArray()
    //         .then((score: HighScore[]) => {
    //             return score;
    //         });
    // }

    async addDefaultScores(): Promise<void> {
        await Promise.all([
            this.highScore_DB.collection(DATABASE.highScore.collections.classical).insertMany(DEFAULT_HIGHSCORE.classical),
            this.highScore_DB.collection(DATABASE.highScore.collections.log2290).insertMany(DEFAULT_HIGHSCORE.log2990),
        ]);
    }

    async updateHighScore(highScore: HighScore, gameMode: number): Promise<void> {
        const collection = DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'];
        const lowestScore = await this.highScore_DB.collection(collection).find({}).sort({ score: 1 }).limit(1).toArray();
        if (highScore.score > lowestScore[0].score) {
            this.highScore_DB.collection(collection).insertOne(highScore);
            this.highScore_DB.collection(collection).deleteOne({ id: (lowestScore[0] as Document).id });
        }
    }
}
