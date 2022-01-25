import { syncBoardSuccess } from '@app/actions/board.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { createReducer, on } from '@ngrx/store';

export const boardFeatureKey = 'board';

export const initialState: Letter[][] = [];

export const reducer = createReducer(
    initialState,
    on(syncBoardSuccess, (newBoard) => newBoard),

    // TODO: Implementer les commandes
    // eslint-disable-next-line no-unused-vars
    on(placeWordSuccess, (state, { word }) => ({ ...state })),
);
