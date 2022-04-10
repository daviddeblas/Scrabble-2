import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { deleteDictionary, loadDictionaries } from '@app/actions/dictionaries.actions';
import { DictionaryFormDialogComponent } from '@app/components/dictionary-form-dialog/dictionary-form-dialog.component';
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

    constructor(private store: Store<{ dictionaries: iDictionary[] }>, public dialog: MatDialog) {
        this.dictionaries$ = store.select('dictionaries');
        store.dispatch(loadDictionaries());
    }

    addDictionary() {
        const dialogRef = this.dialog.open(DictionaryFormDialogComponent);
        const dialogComponent = dialogRef.componentInstance;
        dialogComponent.fileRequired = true;
    }

    resetDictionaries() {}

    modifyDictionary(index: number, currentDictionary: iDictionary): void {
        const dialogRef = this.dialog.open(DictionaryFormDialogComponent);
        const dialogComponent = dialogRef.componentInstance;
        dialogComponent.title = currentDictionary.title;
        dialogComponent.description = currentDictionary.description;
    }

    deleteDictionary(index: number) {
        this.store.dispatch(deleteDictionary({ index }));
    }

    downloadDictionary(index: number) {}

    ngOnInit(): void {}
}
