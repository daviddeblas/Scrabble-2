import { BOT_NAME_DATABASE } from '@app/constantes';
import { Db, MongoClient, WithId } from 'mongodb';
import { Container, Service } from 'typedi';
import { BotNameService } from './bot-name.service';
import { BotDifficulty } from './bot.service';

@Service()
export class BotNameDatabaseService {
    private botNameDB: Db;
    private client: MongoClient;
    async start(url: string) {
        try {
            const client = new MongoClient(url);
            this.client = client;
            this.botNameDB = client.db(BOT_NAME_DATABASE.botNames.name);

            await this.client.connect();

            let easyBotNames: string[] = [];
            this.botNameDB
                .collection(BOT_NAME_DATABASE.botNames.collections.easyBot)
                .find({})
                .toArray()
                .then((botName: WithId<Document>[]) => {
                    easyBotNames = botName.map((name) => name as unknown as string);
                });
            let hardBotNames: string[] = [];
            this.botNameDB
                .collection(BOT_NAME_DATABASE.botNames.collections.hardBot)
                .find({})
                .toArray()
                .then((botName: WithId<Document>[]) => {
                    hardBotNames = botName.map((name) => name as unknown as string);
                });

            Container.get(BotNameService).setBotNames(easyBotNames, hardBotNames);
        } catch {
            // recevoir message si le base de donnees n'est pas connectee
            throw Error('erreur de connection');
        }
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async addBotName(botDifficulty: BotDifficulty, name: string): Promise<void> {
        const collection = BOT_NAME_DATABASE.botNames.collections[botDifficulty === BotDifficulty.Easy ? 'easyBot' : 'hardBot'];
        this.botNameDB.collection(collection).insertOne({ name });
    }

    async removeBotName(botDifficulty: BotDifficulty, name: string): Promise<void> {
        const collection = BOT_NAME_DATABASE.botNames.collections[botDifficulty === BotDifficulty.Easy ? 'easyBot' : 'hardBot'];
        this.botNameDB.collection(collection).deleteOne({ name });
    }

    async changeName(botDifficulty: BotDifficulty, previousName: string, modifiedName: string): Promise<void> {
        const collection = BOT_NAME_DATABASE.botNames.collections[botDifficulty === BotDifficulty.Easy ? 'easyBot' : 'hardBot'];
        this.botNameDB.collection(collection).updateOne({ name: previousName }, { $set: { name: modifiedName } });
    }

    async resetDB(): Promise<void> {
        await this.botNameDB.dropCollection(BOT_NAME_DATABASE.botNames.collections.easyBot);
        await this.botNameDB.dropCollection(BOT_NAME_DATABASE.botNames.collections.hardBot);
    }
}
