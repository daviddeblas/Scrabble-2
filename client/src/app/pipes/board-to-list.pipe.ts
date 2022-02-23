import { Pipe, PipeTransform } from '@angular/core';
import { PlacedLetter } from '@app/classes/placed-letter';
import { BoardState } from '@app/reducers/board.reducer';
import { Letter } from 'common/classes/letter';

@Pipe({
    name: 'boardToList',
})
export class BoardToListPipe implements PipeTransform {
    transform(value: BoardState | null): PlacedLetter[] {
        const list: PlacedLetter[] = [];
        if (!value) return list;
        for (let i = 0; i < value.board.length; i++) {
            for (let j = 0; j < value.board[i].length; j++) {
                if (value.board[i][j]) {
                    const isBlank = !!value.blanks.find((v) => v.x === i && v.y === j);
                    list.push({
                        letter: value.board[i][j] as Letter,
                        position: { x: i, y: j },
                        blank: isBlank,
                    });
                }
            }
        }
        return list;
    }
}
