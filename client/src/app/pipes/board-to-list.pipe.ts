import { Pipe, PipeTransform } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { PlacedLetter } from '@app/classes/placed-letter';

@Pipe({
    name: 'boardToList',
})
export class BoardToListPipe implements PipeTransform {
    transform(value: (Letter | null)[][] | null): PlacedLetter[] {
        const list: PlacedLetter[] = [];
        if (!value) return list;
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < value[i].length; j++) {
                if (value[i][j]) {
                    list.push({
                        letter: value[i][j] as Letter,
                        position: { x: i, y: j },
                    });
                }
            }
        }
        return list;
    }
}
