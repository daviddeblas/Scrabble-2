import { zoomIn, zoomOut } from '@app/actions/local-settings.actions';
import { createReducer, on } from '@ngrx/store';

const ZOOM_MAX = 1.5;
const ZOOM_MIN = 1.0;
const ZOOM_STEP = 0.1;

export const localSettingsFeatureKey = 'localSettings';

export interface LocalSettings {
    zoom: number;
}

export const initialState: LocalSettings = { zoom: 1 };

export const reducer = createReducer(
    initialState,
    on(zoomIn, (state) => {
        if (state.zoom + ZOOM_STEP > ZOOM_MAX) {
            return { ...state, zoom: ZOOM_MAX };
        }
        return { ...state, zoom: state.zoom + ZOOM_STEP };
    }),
    on(zoomOut, (state) => {
        if (state.zoom - ZOOM_STEP < ZOOM_MIN) {
            return { ...state, zoom: ZOOM_MIN };
        }
        return { ...state, zoom: state.zoom - ZOOM_STEP };
    }),
);
