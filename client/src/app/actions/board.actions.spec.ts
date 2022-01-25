import { Direction } from '@app/classes/word';
import * as fromBoard from './board.actions';

describe('loadBoards', () => {
    it('should return an action', () => {
        expect(fromBoard.addWord({ word: { letters: ['A', 'L', 'L', 'O'], position: { x: 0, y: 0 }, direction: Direction.VERTICAL } }).type).toBe(
            '[Board] Place New Word',
        );
    });
});
