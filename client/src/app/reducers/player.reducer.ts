import { startGameSuccess } from '@app/actions/game-status.actions';
import { exchangeLettersSuccess, placeWordSuccess } from '@app/actions/player.actions';
import { Player } from '@app/classes/player';
import { createReducer, on } from '@ngrx/store';

export const playerFeatureKey = 'players';

export interface Players {
    player?: Player;
    opponent?: Player;
}

export const initialState: Players = {};

export const reducer = createReducer(
    initialState,
    on(startGameSuccess, (state, { players }) => players),

    // TODO: Implementer les commandes
    // eslint-disable-next-line no-unused-vars
    on(placeWordSuccess, (state, { newLetters, newScore }) => ({ ...state })),
    // eslint-disable-next-line no-unused-vars
    on(exchangeLettersSuccess, (state, { newLetters }) => ({ ...state })),
);
