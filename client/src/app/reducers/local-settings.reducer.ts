import { createReducer } from '@ngrx/store';

export const localSettingsFeatureKey = 'localSettings';

export interface LocalSettings {
    zoom: number;
}

export const initialState: LocalSettings = { zoom: 1 };

export const reducer = createReducer(initialState);
