import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameHistoryTableComponent } from './game-history-table.component';

describe('GameHistoryTableComponent', () => {
    let component: GameHistoryTableComponent;
    let fixture: ComponentFixture<GameHistoryTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameHistoryTableComponent],
            imports: [AppMaterialModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameHistoryTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
