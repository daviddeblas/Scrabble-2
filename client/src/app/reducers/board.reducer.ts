import { syncBoardSuccess } from '@app/actions/board.actions';
import { placeWord } from '@app/actions/game.actions';
import { Letter } from '@app/classes/letter';
import { createReducer, on } from '@ngrx/store';

export const boardFeatureKey = 'board';

export const initialState: Letter[][] = [];

export const reducer = createReducer(
    initialState,
    on(syncBoardSuccess, (newBoard) => newBoard),

    // eslint-disable-next-line no-unused-vars
    on(placeWord, (state, { word }) => {
        const newState = state;
        // TODO: Implementer ajouter un mot
        return newState;
    }),
);
