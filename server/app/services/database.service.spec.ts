import { DatabaseService } from '@app/services/database.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    const player1 = { name: 'player1', score: 100 };
    const player2 = { name: 'player2', score: 10 };

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseService.client) {
            await databaseService.client.close();
        }
    });

    it('should connect to the database when databaseConnect is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.DatabaseConnect(mongoUri);
        expect(databaseService.client).toBeDefined();
    });

    it('should not connect to the database when databaseConnect is called with the wrong URL', async () => {
        try {
            await databaseService.databaseConnect('WRONG URL');
            fail();
        } catch {
            expect(databaseService.client).not.toBeDefined();
        }
    });
});
