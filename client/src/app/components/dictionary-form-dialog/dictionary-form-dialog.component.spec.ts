import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryFormDialogComponent } from './dictionary-form-dialog.component';

describe('DictionaryFormDialogComponent', () => {
  let component: DictionaryFormDialogComponent;
  let fixture: ComponentFixture<DictionaryFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictionaryFormDialogComponent ]
    })
    .compileComponents();
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
