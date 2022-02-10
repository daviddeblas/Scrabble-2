import { Bag } from './bag';
import { GameConfig } from '@app/classes/game-config';
import { expect } from 'chai';
import Container from 'typedi';
import { GameConfigService } from '@app/services/game-config.service';
import { Letter } from '@app/classes/letter';

const LETTERS_TO_GET = 7;

describe('bag', () => {
    let bag: Bag;
    const gameConfig: GameConfig = Container.get(GameConfigService).configs.configs[0];

    beforeEach(() => {
        bag = new Bag(gameConfig);
    });

    it('constructor', () => {
        expect(bag.letters.length).to.eq(gameConfig.letters.map((l) => l.amt).reduce((sum, amt) => sum + amt));
        expect(bag.letters.filter((l) => l === ('A' as Letter)).length).to.eq(gameConfig.letters.find((l) => l.letter === ('A' as Letter))?.amt);
    });

    it('get letters should return the right amount of letters', () => {
        const baseBagLength = bag.letters.length;
        expect(bag.getLetters(LETTERS_TO_GET).length).to.eq(LETTERS_TO_GET);
        expect(bag.letters.length).to.eq(baseBagLength - LETTERS_TO_GET);
    });

    it('exchange letters should return the right amount of letters', () => {
        const baseBagLength = bag.letters.length;
        expect(bag.exchangeLetters(['A', 'A', 'A', 'A', 'A', 'A', 'A']).length).to.eq(LETTERS_TO_GET);
        expect(bag.letters.length).to.eq(baseBagLength);
    });
});
