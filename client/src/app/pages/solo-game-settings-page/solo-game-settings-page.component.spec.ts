import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoloGameSettingsPageComponent } from './solo-game-settings-page.component';

describe('SoloGameSettingsPageComponent', () => {
    let component: SoloGameSettingsPageComponent;
    let fixture: ComponentFixture<SoloGameSettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloGameSettingsPageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameSettingsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
