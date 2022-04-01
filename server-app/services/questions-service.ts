import { BadRequest } from "../types/errors/bad-request";

import { questionsSetDao } from "../dao/questions-set";
import { QuestionsSet } from "../types/questions-set";

export const getQuestions = async (id: string): Promise<QuestionsSet> => {
    const questionsSet = {
        id: '12',
        questions: [
            'Кто',
            'С кем',
            'Где',
            'Что делали',
            'Кто увидел',
            'Что сказал',
            'Что ответили',
        ],
    };

    if (questionsSet === null) {
        throw new BadRequest("Invalid questions set id: not found");
    }

    return questionsSet;
};
