import { createAction, props } from '@ngrx/store';
import { Log2990Objective } from 'common/interfaces/log2990-objectives';

export const objectiveState = createAction('[Game Objective] Objective State', props<{ objective: Log2990Objective }>());
