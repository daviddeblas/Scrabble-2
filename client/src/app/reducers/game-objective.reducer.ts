import { refreshObjectiveState } from '@app/actions/game-objective.actions';
import { createReducer, on } from '@ngrx/store';
import { Log2990Objective } from 'common/interfaces/log2990-objectives';

export interface GameObjectives {
    publicObjectives: Log2990Objective[];
    privateObjectives: Log2990Objective[];
}

export const gameObjectiveFeatureKey = 'gameObjective';

export const initialState: GameObjectives = {
    publicObjectives: [],
    privateObjectives: [],
};

export const reducer = createReducer(
    initialState,
    on(refreshObjectiveState, (state, { publicObjectives, privateObjectives }) => {
        return { publicObjectives, privateObjectives };
    }),
);
