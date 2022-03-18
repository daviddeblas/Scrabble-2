import dictionaryJson from '@app/../assets/dictionary.json';
import { Dictionary } from '@app/classes/dictionary';
import { BOARD_SIZE } from 'common/constants';
import { Board } from './game/board';

describe('solver', () => {
    const dictionary: Dictionary = Object.assign(new Dictionary(), dictionaryJson);
    let board: Board;
    beforeEach(() => {
        board = {} as Board;
        board.board = [...new Array(BOARD_SIZE)].map(() => new Array(BOARD_SIZE).fill(null));
    });
});
