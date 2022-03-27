import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { browserReload } from '@app/actions/browser.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { EffectsRootModule } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, AppMaterialModule],
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigateToUrl']),
                },
                provideMockStore(),
                {
                    provide: EffectsRootModule,
                    useValue: {
                        addEffects: jasmine.createSpy('addEffects'),
                    },
                },
                provideMockStore(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        store = TestBed.inject(MockStore);
        store.overrideSelector('gameObjective', { publicObjectives: [], privateObjectives: [] });
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch browserReload when window reload', () => {
        component.catchBrowserLoad(new Event('load'));

        const expectedAction = cold('a', { a: browserReload() });

        expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
