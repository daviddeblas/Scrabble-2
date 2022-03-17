export interface HighScore {
    name: string;
    score: number;
}

export const DEFAULT_HIGHSCORE = {
    classical: [
        { name: 'name1', score: 0 },
        { name: 'name2', score: 1 },
        { name: 'name3', score: 2 },
        { name: 'name4', score: 3 },
        { name: 'name5', score: 4 },
    ] as HighScore[],
    log2990: [
        { name: 'name1', score: 0 },
        { name: 'name2', score: 1 },
        { name: 'name3', score: 2 },
        { name: 'name4', score: 3 },
        { name: 'name5', score: 4 },
    ] as HighScore[],
};

export const DATABASE = {
    url: 'mongodb+srv://log2990-101:log2990-101@cluster0.qzik0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    highScore: {
        name: 'Scores_DB',
        collections: {
            classical: 'ScoresClassic',
            log2290: 'ScoresLog2990',
        },
    },
};
