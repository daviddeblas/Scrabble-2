import { Letter } from '@app/classes/letter';
import { Multiplier } from './multiplier';

export class Box {
    constructor(public letter: Letter | null = null, public multiplier: Multiplier | null = null) {}
}
