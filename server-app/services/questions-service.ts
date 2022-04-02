import { BadRequest } from "../types/errors/bad-request";

import { QuestionsSet } from "../types/questions-set";
import { QUESTIONS_MOCK } from "../utils/mocks";

export const getQuestions = async (id: string): Promise<QuestionsSet> => {
    // const questionsSet = await questionsSetDao.findOneById(id);
    const questionsSet = QUESTIONS_MOCK;

    if (questionsSet === null) {
        throw new BadRequest("Invalid questions set id: not found");
    }

    return questionsSet;
};
