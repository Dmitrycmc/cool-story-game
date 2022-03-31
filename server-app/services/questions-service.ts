import { BadRequest } from "../types/errors/bad-request";

import { questionsSetDao } from "../dao/questions-set";
import { QuestionsSet } from "../types/questions-set";

export const getQuestions = async (id: string): Promise<QuestionsSet> => {
    const questionsSet = await questionsSetDao.findOneById(id);

    if (questionsSet === null) {
        throw new BadRequest("Invalid questions set id: not found");
    }

    return questionsSet;
};
