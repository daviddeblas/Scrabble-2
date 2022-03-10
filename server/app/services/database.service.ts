import { DATABASE } from '@app/classes/highscore';
import { Db, MongoClient } from 'mongodb';

// const DATABASE_URL = 'mongodb+srv://log2990-101:<log2990-101>@cluster0.qzik0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const DATABASE_NAME = 'Scores_DB';
// const DATABASE_COLLECTIONS = 'Scores';

export class DatabaseService {
    private highScore_DB: Db;
    private client: MongoClient;
    // private options: MongoClientOptions = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // };

    async start(url: string): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.highScore_DB = client.db(DATABASE.highScore.name);
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
            this.highScore_DB.dropCollection(DATABASE.highScore.collections.classical),
            this.highScore_DB.dropCollection(DATABASE.highScore.collections.log2290),
        ]);
    }
}
