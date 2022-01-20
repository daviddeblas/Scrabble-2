import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePreparationPageComponent } from './game-preparation-page.component';

describe('GamePreparationPageComponent', () => {
  let component: GamePreparationPageComponent;
  let fixture: ComponentFixture<GamePreparationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamePreparationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePreparationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
