import { Vec2 } from 'common/classes/vec2';
import { Direction, Word } from './word';

describe('Word', () => {
    it('should create an instance', () => {
        expect(new Word(['A', 'L', 'L', 'O'], new Vec2(0, 0), Direction.HORIZONTAL)).toBeTruthy();
    });

    it('should return the word length', () => {
        const word = new Word(['A', 'L', 'L', 'O'], new Vec2(0, 0), Direction.HORIZONTAL);
        expect(word.length()).toEqual(['A', 'L', 'L', 'O'].length);
    });
});
