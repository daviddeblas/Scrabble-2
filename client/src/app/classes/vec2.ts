import { ASCII_ALPHABET_POSITION } from '@app/constants';

export interface Vec2 {
    x: number;
    y: number;
}

export const boardPositionToVec2 = (position: string): Vec2 => {
    return {
        x: parseInt(position.substring(1), 10) - 1,
        y: position.slice(0).charCodeAt(0) - ASCII_ALPHABET_POSITION,
    };
};
