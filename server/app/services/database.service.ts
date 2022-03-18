import { DATABASE, HighScore } from '@app/classes/highscore';
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private highScoreDB: Db;
    private client: MongoClient;

    async start(url: string): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.highScoreDB = client.db(DATABASE.highScore.name);
        } catch {
            throw Error('Database connection error');
        }
        if (
            (await this.highScoreDB.collection(DATABASE.highScore.collections.classical).countDocuments()) === 0 &&
            (await this.highScoreDB.collection(DATABASE.highScore.collections.log2290).countDocuments()) === 0
        ) {
            await this.populateDB();
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        let scores: HighScore[];

        for (const score of scores) {
            await this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertOne(score);
            await this.highScoreDB.collection(DATABASE.highScore.collections.log2290).insertOne(score);
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
