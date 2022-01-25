import { Players } from '@app/reducers/player.reducer';
import { createAction, props } from '@ngrx/store';

export const loadPlayers = createAction('[Player] Load Players', props<{ players: Players }>());
