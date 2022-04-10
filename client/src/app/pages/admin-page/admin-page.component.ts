import { Component, OnInit } from '@angular/core';
import { loadDictionaries } from '@app/actions/dictionaries.actions';
import { Store } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    dictionaries$: Observable<iDictionary[]>;

    constructor(store: Store<{ dictionaries: iDictionary[] }>) {
        this.dictionaries$ = store.select('dictionaries');
        store.dispatch(loadDictionaries());
    }

    ngOnInit(): void {}
}
