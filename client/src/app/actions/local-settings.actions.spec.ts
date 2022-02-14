import * as fromLocalSettings from './local-settings.actions';

describe('zoomIn', () => {
    it('should return an action', () => {
        expect(fromLocalSettings.zoomIn().type).toBe('[LocalSettings] Zoom In');
    });
});

describe('zoomOut', () => {
    it('should return an action', () => {
        expect(fromLocalSettings.zoomIn().type).toBe('[LocalSettings] Zoom Out');
    });
});
