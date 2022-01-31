import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameJoinPageComponent } from './game-join-page.component';

describe('GameJoinPageComponent', () => {
  let component: GameJoinPageComponent;
  let fixture: ComponentFixture<GameJoinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameJoinPageComponent ]
    })
    .compileComponents();
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
