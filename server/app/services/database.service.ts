import { DATABASE, DEFAULT_HIGHSCORE, HighScore } from '@app/classes/highscore';
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private highScoreDB: Db;
    private client: MongoClient;

    async start() {
        try {
            const client = new MongoClient(DATABASE.uri);
            this.client = client;
            this.highScoreDB = client.db(DATABASE.highScore.name);
        } catch {
            throw Error('Database connection error');
        }
        await this.client.connect();

        if ((await this.highScoreDB.collection(DATABASE.highScore.collections.classical).countDocuments()) === 0) {
            await this.populateDBClassical();
        }

        if ((await this.highScoreDB.collection(DATABASE.highScore.collections.log2290).countDocuments()) === 0) {
            await this.populateDBlog2990();
        }
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDBClassical(): Promise<void> {
        const scores: HighScore[] = DEFAULT_HIGHSCORE.classical;

        for (const score of scores) {
            await this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertOne(score);
        }
    }

    async populateDBlog2990(): Promise<void> {
        const scores: HighScore[] = DEFAULT_HIGHSCORE.log2990;

        for (const score of scores) {
            await this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertOne(score);
        }
    }

    get database(): Db {
        return this.highScoreDB;
    }

    async resetDB() {
        return Promise.all([
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.classical),
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.log2290),
        ]);
    }
}
