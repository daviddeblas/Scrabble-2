import { Letter } from 'common/classes/letter';
import { Dictionary } from './dictionary';
export class Solver {
    constructor(private dictionary: Dictionary, private board: (Letter | null)[][], private easel: Letter[]) {}
}
