import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { KeyManagerService } from './key-manager.service';

describe('KeyManagerService', () => {
    let service: KeyManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideMockStore()] });
        service = TestBed.inject(KeyManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
