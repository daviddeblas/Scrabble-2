import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiConfigWindowComponent } from './multi-config-window.component';

describe('MultiConfigWindowComponent', () => {
  let component: MultiConfigWindowComponent;
  let fixture: ComponentFixture<MultiConfigWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiConfigWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiConfigWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
