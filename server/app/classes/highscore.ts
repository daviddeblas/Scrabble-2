export interface HighScore {
    name: string;
    score: number;
}

export const DEFAULT_HIGHSCORE={
    classical:[
        {name: 'name1', score:0}
        {name: 'name2', score:0}
        {name: 'name3', score:0}
        {name: 'name4', score:0}
        {name: 'name5', score:0}
    ] as HighScore[],
    log2990:[
        {name: 'name1', score:0}
        {name: 'name2', score:0}
        {name: 'name3', score:0}
        {name: 'name4', score:0}
        {name: 'name5', score:0}
    ] as HighScore[],
};