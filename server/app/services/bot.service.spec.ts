/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { Game } from '@app/classes/game/game';
import { expect } from 'chai';
import { BOARD_SIZE, BOT_NAMES } from 'common/constants';
import { restore, stub } from 'sinon';
import Container from 'typedi';
import { BotDifficulty, BotService } from './bot.service';
import { DictionaryService } from './dictionary.service';
import { GameConfigService } from './game-config.service';

describe('Bot service tests', () => {
    let service: BotService;
    let fakeGame: Game;

    beforeEach(async () => {
        await Container.get(DictionaryService).init();
        await Container.get(GameConfigService).init();
        service = new BotService();
        const fakeBoard = new Array(BOARD_SIZE).fill(new Array(BOARD_SIZE).fill(null));
        fakeGame = {
            players: [{}, { easel: ['A', 'B', 'C', 'D', 'E', '*'] }],
            bag: { letters: ['A', 'B', 'C', 'D', 'E', '*'] },
            board: { board: fakeBoard, scorePosition: () => 2 },
            config: Container.get(GameConfigService).configs[0],
        } as unknown as Game;
    });

    afterEach(() => {
        restore();
    });

    it('move should call easyBotMove if the difficulty is easy', () => {
        const easyBotMoveStub = stub(service as any, 'easyBotMove').callsFake(() => '');
        service.move(fakeGame, BotDifficulty.Easy);
        expect(easyBotMoveStub.calledOnce).to.equal(true);
    });

    it('move should return passer if there is no according difficulty', () => {
        expect(service.move(fakeGame, BotDifficulty.Hard)).to.equal('passer');
    });

    it('getName should return one of the bot names', () => {
        const nameChosen = service.getName();
        expect(BOT_NAMES.includes(nameChosen)).to.equal(true);
    });

    it('easyBotMove should return pass command if the random generated number is between 0 and 0.1', () => {
        const expectedNumber = 0.05;
        stub(Math, 'random').callsFake(() => expectedNumber);
        expect(service['easyBotMove'](fakeGame)).to.equal('passer');
    });

    it('easyBotMove should call exchangeCommand if the random generated number is between 0.1 and 0.2', () => {
        const expectedNumber = 0.18;
        const expectedResult = 'échanger a';
        stub(Math, 'random').callsFake(() => expectedNumber);
        const exchangeCommandStub = stub(service as any, 'exchangeCommand').callsFake(() => expectedResult);
        expect(service['easyBotMove'](fakeGame)).to.equal(expectedResult);
        expect(exchangeCommandStub.called).to.equal(true);
    });

    it('easyBotMove should call placeCommand if the random generated number is between 0.2 and 1', () => {
        const expectedNumber = 0.482;
        const expectedResult = 'placer h7h place';
        stub(Math, 'random').callsFake(() => expectedNumber);
        const placeCommandStub = stub(service as any, 'placeCommand').callsFake(() => expectedResult);
        expect(service['easyBotMove'](fakeGame)).to.equal(expectedResult);
        expect(placeCommandStub.called).to.equal(true);
    });

    it('placeCommand should call determineWord if there is at least a solution', (done) => {
        fakeGame.board.board[7][7] = 'E';
        fakeGame.players[1].easel = ['L'];
        stub(service as any, 'determineWord').callsFake(() => done());
        service['placeCommand'](fakeGame, BotDifficulty.Easy);
    });

    it('placeCommand should not call determineWord if there is no solution and return passer', () => {
        const determineWordStub = stub(service as any, 'determineWord');
        const placeResult = service['placeCommand'](fakeGame, BotDifficulty.Easy);
        expect(placeResult).to.equal('passer');
        expect(determineWordStub.calledOnce).to.equal(false);
    });

    it('exchangeCommand should retrieve a random number of letters to exchange', () => {
        const minExchangeCommandLength = 9;
        const exchangeResult = service['exchangeCommand'](fakeGame);
        expect(exchangeResult.includes('échanger')).to.equal(true);
        expect(exchangeResult.length).to.be.greaterThan(minExchangeCommandLength);
    });

    it('exchangeCommand should send pass command if there are not enough letters in the bag', () => {
        fakeGame.bag.letters = [];
        expect(service['exchangeCommand'](fakeGame)).to.equal('passer');
    });

    it('determineWord should send the exchange with least points if the random number is between 0 and 0.4 (40% chance) with botLevel easy', () => {
        const expectedNumber = 0.15;
        stub(Math, 'random').callsFake(() => expectedNumber);
        const fakePlacements = new Map<string[], number>();
        const leastPointsPlacement = ['h7h', 'ab'];
        fakePlacements.set(leastPointsPlacement, 2);
        fakePlacements.set(['another', 'placement'], 10);
        expect(service['determineWord'](fakePlacements, BotDifficulty.Easy)).to.equal('h7h ab');
    });

    it('determineWord should send the exchange with middle amount of points with random number between 0.4 and 0.7 with botLevel easy', () => {
        const expectedNumber = 0.69;
        stub(Math, 'random').callsFake(() => expectedNumber);
        const fakePlacements = new Map<string[], number>();
        const midPointsPlacement = ['h7h', 'ab'];
        fakePlacements.set(midPointsPlacement, 10);
        fakePlacements.set(['another', 'placement'], 15);
        expect(service['determineWord'](fakePlacements, BotDifficulty.Easy)).to.equal('h7h ab');
    });

    it('determineWord should send the exchange with highest amount of points with random number between 0.7 and 1 with botLevel easy', () => {
        const expectedNumber = 0.92;
        stub(Math, 'random').callsFake(() => expectedNumber);
        const fakePlacements = new Map<string[], number>();
        const highPointsPlacement = ['h7h', 'ab'];
        fakePlacements.set(highPointsPlacement, 15);
        fakePlacements.set(['another', 'placement'], 10);
        expect(service['determineWord'](fakePlacements, BotDifficulty.Easy)).to.equal('h7h ab');
    });

    it('determineWord should send passer if bot difficulty hard', () => {
        const fakePlacements = new Map<string[], number>();
        expect(service['determineWord'](fakePlacements, BotDifficulty.Hard)).to.equal('passer');
    });
});
