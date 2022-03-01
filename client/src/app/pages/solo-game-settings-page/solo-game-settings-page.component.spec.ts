import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { SoloGameSettingsPageComponent } from './solo-game-settings-page.component';

describe('SoloGameSettingsPageComponent', () => {
    let component: SoloGameSettingsPageComponent;
    let fixture: ComponentFixture<SoloGameSettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloGameSettingsPageComponent, MultiConfigWindowComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                FormBuilder,
                provideMockStore(),
            ],
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

    // Test a ajusté une fois l'action créer
    /* it('should dispatch createRoom with the gameOptions when onGameOptionsSubmit called', () => {
        const expectedOptions = { name: 'My Name' } as unknown as GameOptions;
        const expectedLevel = 'Débutant';
        component.onGameOptionsSubmit(expectedOptions, expectedLevel);
        const expectedAction = cold('a', { a: createRoom({ gameOptions: expectedOptions, botLevel: expectedLevel }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });*/
});
