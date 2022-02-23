import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { EaselComponent } from './easel.component';

describe('EaselComponent', () => {
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let mouseClickStub: MouseEvent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EaselComponent],
            imports: [AppMaterialModule],
            providers: [provideMockStore()],
        }).compileComponents();
        mouseClickStub = {
            preventDefault: () => {
                return;
            },
        } as unknown as MouseEvent;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call event.preventDefault when selectLetterToSwitch is called', () => {
        const spy = spyOn(mouseClickStub, 'preventDefault');
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('should test if the letter selected has the main color', () => {
        component.letterColor[0] = component.exchangeColor;
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(component.letterColor[0]).toEqual(component.mainColor);
    });

    it('should test if the letter selected has the exchange color', () => {
        component.letterColor[0] = '';
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(component.letterColor[0]).toEqual(component.exchangeColor);
    });

    it('should test if the letter color has exchange color', () => {
        component.letterColor[0] = component.exchangeColor;
        expect(component.letterSelected()).toBeTruthy();
    });

    it('should test if the letter color does not include exchange color', () => {
        component.letterColor[0] = '';
        expect(component.letterSelected()).toBeFalsy();
    });
});
