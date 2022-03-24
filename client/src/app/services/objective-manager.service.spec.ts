import { TestBed } from '@angular/core/testing';

import { ObjectiveManagerService } from './objective-manager.service';

describe('ObjectiveManagerService', () => {
  let service: ObjectiveManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectiveManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
