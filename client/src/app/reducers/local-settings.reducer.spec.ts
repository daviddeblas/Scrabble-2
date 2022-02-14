import { zoomIn } from '@app/actions/local-settings.actions';
import { reducer, ZOOM_MAX, ZOOM_STEP } from './local-settings.reducer';

describe('LocalSettings Reducer', () => {
    describe('zoomIn action', () => {
        it('should zoom in', () => {
            const currentZoom = 1.0;
            const action = zoomIn();
            const result = reducer({ zoom: currentZoom }, action);

            const expected = { zoom: currentZoom + ZOOM_STEP };
            expect(result).toEqual(expected);
        });

        it('should not exceed maximum', () => {
            const currentZoom = ZOOM_MAX - ZOOM_STEP / 2;
            const action = zoomIn();
            const result = reducer({ zoom: currentZoom }, action);

            const expected = { zoom: ZOOM_MAX };
            expect(result).toEqual(expected);
        });
    });
});
