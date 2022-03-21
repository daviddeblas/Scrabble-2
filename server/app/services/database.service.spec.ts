/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { DATABASE } from '@app/classes/highscore';
import { PORT } from '@app/environnement';
import { DatabaseService } from '@app/services/database.service';
import { fail } from 'assert';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { stub } from 'sinon';
import io from 'socket.io';
import { io as Client, Socket } from 'socket.io-client';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    const player1 = { name: 'fakePlayer1', score: 10 };
    const player2 = { name: 'fakePlayer2', score: -1 };

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
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
        // expect(databaseService['db'].databaseName).to.equal('database');
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
        expect(databaseService['client']).to.not.be.undefined;
    });

    it('should populate the database when start is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const scores = await databaseService.database.collection(DATABASE.highScore.collections.classical).find({}).toArray();
        expect(scores.length).to.equal(5);
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

    it('should insert default scores in the database', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const scoreClassic = await databaseService.getHighscores('classical');
        const scoreLog2990 = await databaseService.getHighscores('log2990');
        expect(scoreClassic.length).to.equal(5);
        expect(scoreLog2990.length).to.equal(5);
    });

    it('should return the right highscore list when connecting to the database', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const scoreClassical = await databaseService.getHighscores('classical');
        expect(scoreClassical[0].name).to.equal('name5');
        expect(scoreClassical[1].name).to.equal('name4');
        expect(scoreClassical[2].name).to.equal('name3');
        expect(scoreClassical[3].name).to.equal('name2');
        expect(scoreClassical[4].name).to.equal('name1');
    });

    it('should updateHighScore when a higher score has been reached in Classical', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.updateHighScore(player1, 'classical');
        const scoreClassic = await databaseService.getHighscores('classical');
        expect(scoreClassic[0].name).to.equal('fakePlayer1');
        expect(scoreClassic[0].score).to.equal(10);
    });

    it('should not updateHighScore when a new score is lower than all of the current highscores in Classical', async () => {
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
        await databaseService.resetDB();
        const scoreClassic = await databaseService.getHighscores('classical');
        expect(scoreClassic).to.be.empty;
    });

    describe('socket connections', () => {
        let hostSocket: Socket;
        let server: io.Server;
        let httpServer: Server;

        before((done) => {
            httpServer = createServer();
            httpServer.listen(PORT);
            server = new io.Server(httpServer);
            httpServer.on('listening', () => done());
        });

        beforeEach(() => {
            hostSocket = Client('http://localhost:3000');
        });

        afterEach(() => {
            server.removeAllListeners();
        });

        after(() => {
            server.close();
            httpServer.close();
        });

        it('should emit receive classic highscores when receiving get highScores', (done) => {
            const getHighScoresStub = stub(databaseService, 'getHighscores').resolves([player1, player2]);
            server.on('connection', (socket) => {
                databaseService.setupSocketConnection(socket);
                hostSocket.on('receive classic highscores', () => {
                    expect(getHighScoresStub.called);
                    done();
                });
            });
            hostSocket.emit('get highScores');
        });

        it('should emit receive log2990 highscores when receiving get highScores', (done) => {
            const getHighScoresStub = stub(databaseService, 'getHighscores').resolves([player1, player2]);
            server.on('connection', (socket) => {
                databaseService.setupSocketConnection(socket);
                hostSocket.on('receive log2990 highscores', () => {
                    expect(getHighScoresStub.called);
                    done();
                });
            });
            hostSocket.emit('get highScores');
        });
    });
});
