import { Letter, lettersToString, stringToLetters, stringToLetter } from '@app/classes/letter';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('stringToLetter', () => {
    it('should throw error if input of string is larger than one char', () => {
        expect(() => stringToLetter('aa')).to.throw();
    });
    it('should be equal to its correct character', () => {
        expect(stringToLetter('a')).to.eq('A' as Letter);
    });
});

describe('stringToLetters', () => {
    it('should throw error if input of string contains unwanted characters', () => {
        expect(() => stringToLetters('aAaAiiIlkK&!@#$')).to.throw();
    });
});

describe('lettersToString', () => {
    it('should be equal to its equivalent string', () => {
        expect(lettersToString(['A' as Letter])).to.eq('A');
        expect(lettersToString(stringToLetters('zythums'))).to.eq('ZYTHUMS');
        expect(lettersToString(['Z' as Letter, 'Y' as Letter, 'T' as Letter, 'H' as Letter, 'U' as Letter, 'M' as Letter, 'S' as Letter])).to.eq(
            'ZYTHUMS',
        );
    });
});
