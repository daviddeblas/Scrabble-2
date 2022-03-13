import { Letter } from 'common/classes/letter';
import { Dictionary } from './dictionary';

interface Segment {
    value: string;
    start: number;
    end: number;
}

export class Solver {
    constructor(private dictionary: Dictionary, private board: (Letter | null)[][], private easel: Letter[]) {}

    generateSegments(line: (Letter | null)[]): Segment[] {
        const segments: Segment[] = [];

        let pos = 0;
        while (pos < line.length) {
            while (line[pos] === null && pos < line.length) pos++;
            if (pos === line.length) break;

            const segment: Segment = { start: pos, value: '', end: pos };
            while (line[pos] !== null && pos < line.length) {
                segment.value += line[pos];
                pos++;
            }

            segment.end = pos;
            segments.push(segment);
        }

        return segments;
    }
}
