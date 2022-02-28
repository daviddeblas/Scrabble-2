import { Direction, Word } from './word';

describe('Word', () => {
    it('should create an instance', () => {
        expect(new Word('allo', { x: 0, y: 0 }, Direction.HORIZONTAL)).toBeTruthy();
    });

    it('should return the word length', () => {
        const word = new Word('allo', { x: 0, y: 0 }, Direction.HORIZONTAL);
        expect(word.length()).toEqual('allo'.length);
    });
});
