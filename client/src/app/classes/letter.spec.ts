import { Letter, lettersToString, stringToLetter, stringToLetters } from './letter';

describe('stringToLetter', () => {
    it('should throw error if input of string is larger than one char', () => {
        expect(() => stringToLetter('aa')).toThrow();
    });
    it('should be equal to its correct character', () => {
        expect(stringToLetter('a')).toEqual('A' as Letter);
    });
});

describe('stringToLetters', () => {
    it('should throw error if input of string contains unwanted characters', () => {
        expect(() => stringToLetters('aAaAiiIlkK&!@#$')).toThrow();
    });
});

describe('lettersToString', () => {
    it('should be equal to its equivalent string', () => {
        expect(lettersToString(['A' as Letter])).toEqual('A');

        expect(lettersToString(stringToLetters('zythums'))).toEqual('ZYTHUMS');

        const letter: Letter[] = ['Z', 'Y', 'T', 'H', 'U', 'M', 'S'];
        expect(lettersToString(letter)).toEqual('ZYTHUMS');
    });
});
