// import * as gameObjective from '@app/actions/game-objective.actions';
import { createReducer } from '@ngrx/store';
import { Log2990Objective } from 'common/interfaces/log2990-objectives';

export interface ObjectiveBox {
    publicObjectives: Log2990Objective[];
    privateObjective: Log2990Objective[];
}

export const gameObjectiveFeatureKey = 'gameObjective';

export const initialState: ObjectiveBox = {
    publicObjectives: [],
    privateObjective: [],
};

export const reducer = createReducer(initialState);
