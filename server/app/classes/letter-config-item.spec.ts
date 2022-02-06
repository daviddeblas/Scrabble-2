import { Letter } from './letter';
import { LetterConfigItem } from './letter-config-item';
import { expect } from 'chai';

describe('LetterConfigItem', () => {
    it('constructor', () => {
        const conf = new LetterConfigItem('A' as Letter, 1, 1);
        expect(conf.letter).to.eq('A' as Letter);
        expect(conf.points).to.eq(1);
        expect(conf.amt).to.eq(1);
    });
});
