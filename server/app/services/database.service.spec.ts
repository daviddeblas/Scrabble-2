/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { DATABASE } from '@app/classes/highscore';
import { DatabaseService } from '@app/services/database.service';
import { fail } from 'assert';
import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    const player1 = { name: 'fakePlayer1', score: 10 };
    const player2 = { name: 'fakePlayer2', score: -1 };

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = new MongoMemoryServer();
    });

    afterEach(async () => {
        if (databaseService['client']) {
            await databaseService['client'].close();
        }
    });

    it('should connect to the database when start is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService['client']).to.not.be.undefined;
    });

    it('should not connect to the database when databaseConnect is called with the wrong URL', async () => {
        try {
            await databaseService.start('WRONG_URL');
            fail();
        } catch {
            expect(databaseService['client']).to.be.undefined;
        }
    });

    it('should no longer be connected if close is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.closeConnection();
        expect(databaseService['client']).to.be.false;
    });

    it('should not populate the database with start function if it is already populated', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        let scores = await databaseService.database.collection(DATABASE.highScore.collections.classical).find({}).toArray();
        expect(scores.length).to.equal(5);
        await databaseService.closeConnection();
        await databaseService.start(mongoUri);
        scores = await databaseService.database.collection(DATABASE.highScore.collections.classical).find({}).toArray();
        expect(scores.length).to.equal(5);
    });

    it('should return the right highscore list when connecting to the database', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const scoreClassical = await databaseService.getHighscores('classical');
        expect(scoreClassical[0].name).to.equal('name1');
        expect(scoreClassical[1].name).to.equal('name2');
        expect(scoreClassical[2].name).to.equal('name3');
    });

    it('should insert default scores in the database', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const scoreClassic = await databaseService.getHighscores('classical');
        const scoreLog2990 = await databaseService.getHighscores('log2990');
        expect(scoreClassic.length).to.equal(5);
        expect(scoreLog2990.length).to.equal(5);
    });

    it('should updateHighScore when a higher score has been reached in Classical', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.updateHighScore(player1, 'classical');
        const scoreClassic = await databaseService.getHighscores('classical');
        expect(scoreClassic[0].name).to.equal('fakePlayer1');
        expect(scoreClassic[0].score).to.equal(10);
    });

    it('should not updateHighScore when a new score is lower or equal than all of the current highscores in Classical', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.updateHighScore(player2, 'classical');
        const scoreClassic = await databaseService.getHighscores('classical');
        for (const score of scoreClassic) {
            expect(score.name).to.not.equal('fakePlayer2');
        }
    });

    it('should reset the database when calling resetDB', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        setTimeout(() => {
            databaseService.resetDB();
        }, 5000);
        const scoreClassic = await databaseService.getHighscores('classical');
        expect(scoreClassic).to.be.empty;
    });
});
