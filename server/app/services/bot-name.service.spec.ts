/* eslint-disable dot-notation */
import { expect } from 'chai';
import { EASY_BOT_NAMES, HARD_BOT_NAMES } from 'common/constants';
import { restore } from 'sinon';
import { BotNameService } from './bot-name.service';
import { BotDifficulty } from './bot.service';

describe('Bot Name service tests', () => {
    let service: BotNameService;

    beforeEach(async () => {
        service = new BotNameService();
    });

    afterEach(() => {
        restore();
    });

    it('should return one of the initial easy bot name if no others where added', () => {
        expect(EASY_BOT_NAMES.includes(service.getBotName(BotDifficulty.Easy, 'Player1'))).to.equal(true);
    });

    it('should return one of the hard bot names when some where added', () => {
        const addedName = 'Player';
        service['addedHardNames'].push(addedName);
        const expectedPossibleNames = [...HARD_BOT_NAMES, addedName];
        expect(expectedPossibleNames.includes(service.getBotName(BotDifficulty.Hard, 'Player1'))).to.equal(true);
    });

    it('should add bot name to the addedEasyBotName when difficulty Easy', () => {
        const addedName = 'Player';
        service.addBotName(BotDifficulty.Easy, addedName);
        expect(service['addedEasyNames'].includes(addedName)).to.equal(true);
    });

    it('should add bot name to the addedHardBotName when difficulty Hard', () => {
        const addedName = 'Player';
        service.addBotName(BotDifficulty.Hard, addedName);
        expect(service['addedHardNames'].includes(addedName)).to.equal(true);
    });

    it('should remove bot name to the addedEasyBotName when difficulty Easy', () => {
        const addedName = 'Player';
        service['addedEasyNames'].push(addedName);
        service.removeBotName(BotDifficulty.Easy, addedName);
        expect(service['addedEasyNames'].includes(addedName)).to.equal(false);
    });

    it('should remove bot name to the addedHardBotName when difficulty Hard', () => {
        const addedName = 'Player';
        service['addedHardNames'].push(addedName);
        service.removeBotName(BotDifficulty.Hard, addedName);
        expect(service['addedHardNames'].includes(addedName)).to.equal(false);
    });

    it('should not remove anything if name is not in array when difficulty Easy', () => {
        const addedName = 'Player';
        service['addedEasyNames'].push(addedName);
        const oldArrayNames = service['addedEasyNames'];
        service.removeBotName(BotDifficulty.Easy, 'Player 1');
        expect(service['addedEasyNames']).to.equal(oldArrayNames);
    });

    it('should not remove anything if name is not in array when difficulty Hard', () => {
        const addedName = 'Player';
        service['addedHardNames'].push(addedName);
        const oldArrayNames = service['addedHardNames'];
        service.removeBotName(BotDifficulty.Hard, 'Player 1');
        expect(service['addedHardNames']).to.equal(oldArrayNames);
    });

    it('resetAllNames should reset all modifiable lists to empty', () => {
        const addedName = 'Player';
        service['addedHardNames'].push(addedName);
        service['addedEasyNames'].push(addedName);
        service.resetAllNames();
        expect(service['addedEasyNames'].length).to.equal(0);
        expect(service['addedHardNames'].length).to.equal(0);
    });
});
