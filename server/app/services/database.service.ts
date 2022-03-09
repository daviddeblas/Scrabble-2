import { Db, MongoClient, MongoClientOptions } from 'mongodb';
const DATABASE_URL = 'mongodb+srv://log2990-101:<log2990-101>@cluster0.qzik0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'highScores';
const DATABASE_COLLECTIONS = 'highScores_coll';

export class DatabaseService {
    private db: Db;
    private client: MongoClient;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw Error('Database connection error');
        }

        if ((await this.db.collection(DATABASE_COLLECTIONS).countDocuments()) === 0) {
            await this.populateDB();
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }
}
