import { loadPlayers } from '@app/actions/player.actions';
import { Player } from '@app/classes/player';
import { createReducer, on } from '@ngrx/store';

export const playerFeatureKey = 'player';

export interface Players {
    player?: Player;
    opponent?: Player;
}

export const initialState: Players = {};

export const reducer = createReducer(
    initialState,
    on(loadPlayers, (state, { players }) => players),
);
