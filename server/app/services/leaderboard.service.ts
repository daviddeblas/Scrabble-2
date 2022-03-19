import { GameMode } from '@app/classes/game-configs';
import { DATABASE, DEFAULT_HIGHSCORE, HighScore, NUMBER_OF_SCORES } from '@app/classes/highscore';
import { Db, Document, WithId } from 'mongodb';
import io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class LeaderboardService {
    private highScoreDB: Db;

    async getHighscores(gameMode: number): Promise<HighScore[]> {
        return this.highScoreDB
            .collection(DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'])
            .find({})
            .sort({ score: -1 })
            .limit(NUMBER_OF_SCORES)
            .toArray()
            .then((score: WithId<Document>[]) => {
                return score.map((s) => s as unknown as HighScore);
            });
    }

    async addDefaultScores(): Promise<void> {
        await Promise.all([
            this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertMany(DEFAULT_HIGHSCORE.classical),
            this.highScoreDB.collection(DATABASE.highScore.collections.log2290).insertMany(DEFAULT_HIGHSCORE.log2990),
        ]);
    }

    async updateHighScore(highScore: HighScore, gameMode: number): Promise<void> {
        const collection = DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'];
        const lowestScore = await this.highScoreDB.collection(collection).find({}).sort({ score: 1 }).limit(1).toArray();
        if (highScore.score > lowestScore[0].score) {
            this.highScoreDB.collection(collection).insertOne(highScore);
            this.highScoreDB.collection(collection).deleteOne({ id: (lowestScore[0] as Document).id });
        }
    }

    setupSocketConnection(socket: io.Socket) {
        socket.on('get highScores', () => {
            socket.emit('receive highScores', this.getHighscores(1));
        });
    }
}
