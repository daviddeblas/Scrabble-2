import { DATABASE } from '@app/classes/highscore';
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
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async resetDB() {
        return Promise.all([
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.classical),
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.log2290),
        ]);
    }
}
