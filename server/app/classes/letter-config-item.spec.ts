import { expect } from 'chai';
import { Letter } from './letter';
import { LetterConfigItem } from './letter-config-item';

describe('LetterConfigItem', () => {
    it('constructor', () => {
        const conf = new LetterConfigItem('A' as Letter, 1, 1);
        expect(conf.letter).to.eq('A' as Letter);
        expect(conf.points).to.eq(1);
        expect(conf.amount).to.eq(1);
    });
});
