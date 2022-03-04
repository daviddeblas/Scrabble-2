/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { KeyManagerService } from '@app/services/key-manager.service';
import { Actions } from '@ngrx/effects';

@Injectable()
export class BoardEffects {
    constructor(private actions$: Actions, private keyManager: KeyManagerService) {}
}
