import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ObjectiveManagerService {
    message = new BehaviorSubject(false);

    // Message unexpected this de esLint si je l'enlève erreur TypeScript
    // eslint-disable-next-line no-invalid-this
    mode = this.message.asObservable();

    // constructor() {}

    nextMessage(message: boolean) {
        this.message.next(message);
    }
}
