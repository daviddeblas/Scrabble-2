import { DATABASE, DEFAULT_HIGHSCORE } from '@app/classes/highscore';
import { Db } from 'mongodb';
import {} from ;

export class LeaderboardService{
    private highScoreDB: Db;
    // get collection(): Collection<Player>{
    //     return this.databaseService.database.collection(DATABASE_COLLECTION);
    // }

    async getHighscores(): Promise<highScores[]>{
        return this.collection
            .find({})
            .toArray()
            .then((scores: Scores[])=>{
                return scores;
            });
    }

    async addDefaultScores(): Promise<void>{
        await Promise.all([
            this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertMany(DEFAULT_HIGHSCORE.classical),
            this.highScoreDB.collection(DATABASE.highScore.collections.log2290).insertMany(DEFAULT_HIGHSCORE.log2990),
        ]);
    }
}