import { Log2990Objective } from 'common/interfaces/log2990-objectives';

export const LOG2990OBJECTIVES: Log2990Objective[] = [
    {
        description: 'Créer un palindrome de 4 lettres ou plus',
        value: 'Double les points de placement',
        isValidated: false,
    },
    {
        description: 'Placer 3 ou plus consonnes seulement',
        value: 'Bonus de 60',
        isValidated: false,
    },
    {
        description: "Ralonger le début et la fin d'un mot existant de plus de deux lettres",
        value: 'Bonus de 30',
        isValidated: false,
    },
    {
        description: 'Faire un placement rapportant plus de 20 points dans les 10 premières secondes du tour',
        value: 'Bonus de 45',
        isValidated: false,
    },
    {
        description: 'Placer deux lettres qui valent 8 points ou plus en un tour',
        value: 'Bonus de 70',
        isValidated: false,
    },
    {
        description: 'Faire un mot de plus de 10 lettres',
        value: 'Bonus de 50',
        isValidated: false,
    },
    {
        description: 'Avoir exactement 69 points',
        value: 'Bonus de 69',
        isValidated: false,
    },
    {
        description: 'Placer le mot : ',
        value: 'Bonus de 70',
        isValidated: false,
    },
];

export const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];

export const NO_POINTS = 0;
