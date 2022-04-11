import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { DictionaryFormDialogComponent } from './dictionary-form-dialog.component';

describe('DictionaryFormDialogComponent', () => {
    let component: DictionaryFormDialogComponent;
    let fixture: ComponentFixture<DictionaryFormDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [DictionaryFormDialogComponent],
            providers: [
                provideMockStore(),
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
