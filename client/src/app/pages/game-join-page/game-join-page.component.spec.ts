import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomEffects } from '@app/effects/room.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { GameJoinPageComponent } from './game-join-page.component';

describe('GameJoinPageComponent', () => {
    let component: GameJoinPageComponent;
    let fixture: ComponentFixture<GameJoinPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameJoinPageComponent],
            imports: [ReactiveFormsModule, FormsModule],
            providers: [
                provideMockStore(),
                {
                    provide: RoomEffects,
                    useValue: jasmine.createSpyObj('roomEffects', [], ['dialogRef']),
                },
                { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameJoinPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
