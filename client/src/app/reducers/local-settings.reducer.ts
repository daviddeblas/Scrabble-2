import { zoomIn, zoomOut } from '@app/actions/local-settings.actions';
import { createReducer, on } from '@ngrx/store';

export const localSettingsFeatureKey = 'localSettings';

export interface LocalSettings {
    zoom: number;
}

export const initialState: LocalSettings = { zoom: 1 };

export const reducer = createReducer(
    initialState,
    on(zoomIn, (state) => {
        state.zoom += 0.1;
        return state;
    }),
    on(zoomOut, (state) => {
        state.zoom -= 0.1;
        return state;
    }),
);
