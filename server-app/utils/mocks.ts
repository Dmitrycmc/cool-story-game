import { QuestionsSet } from "../types/questions-set";

export const QUESTIONS_MOCK: QuestionsSet = {
    id: '12',
    questions: ['Кто', 'С кем', 'Где', 'Что делали', 'Кто увидел', 'Что сказал', 'Что ответили'],
    dictionary: [
        ['Однажды', 'На днях', 'Как-то раз'],
        ['их увидел(а)'],
        ['и сказал(а)'],
        ['на что они ему ответили'],
    ],
    template: '[0] {0} {1} {3} {2}, [1] {4} [2]: "{5}", [3] {6}',
};
