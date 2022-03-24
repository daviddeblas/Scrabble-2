import { DATABASE, DEFAULT_HIGHSCORE, HighScore, NUMBER_OF_SCORES } from '@app/classes/highscore';
import { GameMode } from 'common/interfaces/game-mode';
import { Db, MongoClient, WithId } from 'mongodb';
import io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private highScoreDB: Db;
    private client: MongoClient;
    async start(url: string) {
        try {
            const client = new MongoClient(url);
            this.client = client;
            this.highScoreDB = client.db(DATABASE.highScore.name);

            await this.client.connect();

            if ((await this.highScoreDB.collection(DATABASE.highScore.collections.classical).countDocuments()) === 0) {
                await this.populateDBClassical();
            }

            if ((await this.highScoreDB.collection(DATABASE.highScore.collections.log2990).countDocuments()) === 0) {
                await this.populateDBlog2990();
            }
        } catch {
            // recevoir message si le base de donnees n'est pas connectee
            throw Error('erreur de connection');
        }
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async getHighscores(gameMode: string): Promise<HighScore[]> {
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

    async updateHighScore(highScore: HighScore, gameMode: string): Promise<void> {
        const collection = DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'];
        const equalScore = await this.highScoreDB.collection(collection).findOne({ score: highScore.score });
        if (equalScore) {
            if (equalScore.name.includes(highScore.name)) return;
            await this.highScoreDB.collection(collection).deleteOne({ score: highScore.score });
            highScore.name = equalScore.name + ' - ' + highScore.name;
        }

        this.highScoreDB.collection(collection).insertOne(highScore);
    }

    get database(): Db {
        return this.highScoreDB;
    }

    async resetDB() {
        await this.highScoreDB.dropCollection(DATABASE.highScore.collections.classical);
        await this.highScoreDB.dropCollection(DATABASE.highScore.collections.log2990);
    }

    setupSocketConnection(socket: io.Socket) {
        socket.on('get highScores', () => {
            this.getHighscores('classical').then((value) => {
                socket.emit('receive classic highscores', value);
            });
            this.getHighscores('log2990').then((value) => {
                socket.emit('receive log2990 highscores', value);
            });
        });
    }

    private async populateDBClassical() {
        const scores: HighScore[] = DEFAULT_HIGHSCORE.classical;

        for (const score of scores) {
            await this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertOne(score);
        }
    }

    private async populateDBlog2990() {
        const scores: HighScore[] = DEFAULT_HIGHSCORE.log2990;

        for (const score of scores) {
            await this.highScoreDB.collection(DATABASE.highScore.collections.log2990).insertOne(score);
        }
    }
}
