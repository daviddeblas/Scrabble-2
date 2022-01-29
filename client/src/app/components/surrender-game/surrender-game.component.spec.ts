import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { SurrenderGameComponent } from './surrender-game.component';

describe('SurrenderGameComponent', () => {
    let component: SurrenderGameComponent;
    let fixture: ComponentFixture<SurrenderGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SurrenderGameComponent],
            imports: [AppMaterialModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurrenderGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
