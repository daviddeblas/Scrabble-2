import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DictionariesAdministratorComponent } from '@app/components/dictionaries-administrator/dictionaries-administrator.component';
import { GameHistoryTableComponent } from '@app/components/game-history-table/game-history-table.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule],
            declarations: [AdminPageComponent, GameHistoryTableComponent, DictionariesAdministratorComponent],
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: 'gameHistory',
                            value: { gameHistory: {} },
                        },
                    ],
                }),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
