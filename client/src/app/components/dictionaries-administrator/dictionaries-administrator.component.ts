import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { deleteDictionary, downloadDictionary, loadDictionaries, resetDictionaries } from '@app/actions/dictionaries.actions';
import { Store } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';
import { Observable } from 'rxjs';
import { DictionaryFormDialogComponent } from '../dictionary-form-dialog/dictionary-form-dialog.component';

@Component({
    selector: 'app-dictionaries-administrator',
    templateUrl: './dictionaries-administrator.component.html',
    styleUrls: ['./dictionaries-administrator.component.scss'],
})
export class DictionariesAdministratorComponent implements OnInit {
    dictionaries$: Observable<iDictionary[]>;

    constructor(private store: Store<{ dictionaries: iDictionary[] }>, public dialog: MatDialog) {
        this.dictionaries$ = store.select('dictionaries');
        store.dispatch(loadDictionaries());
    }

    addDictionary() {
        const dialogRef = this.dialog.open(DictionaryFormDialogComponent);
        const dialogComponent = dialogRef.componentInstance;
        dialogComponent.fileRequired = true;
    }

    resetDictionaries() {
        this.store.dispatch(resetDictionaries());
    }

    modifyDictionary(index: number, currentDictionary: iDictionary): void {
        const dialogRef = this.dialog.open(DictionaryFormDialogComponent);
        const dialogComponent = dialogRef.componentInstance;
        dialogComponent.dictionaryIndex = index;
        dialogComponent.currentDictionary = currentDictionary;
    }

    deleteDictionary(dictionary: iDictionary) {
        this.store.dispatch(deleteDictionary({ dictionary }));
    }

    downloadDictionary(dictionary: iDictionary) {
        this.store.dispatch(downloadDictionary({ dictionary }));
    }

    ngOnInit(): void {}
}
